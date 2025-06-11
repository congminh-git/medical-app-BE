import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';
import { Patient } from '../patients/patients.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Doctor } from '../doctors/doctors.entity';
import { UserStatus } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async getUsers() {
    const users = await this.userRepository.find();
    const sanitizedUsers = users.map(({ password_hash, ...user }) => user);
    return {
      status: '200',
      message: 'Lấy danh sách người dùng thành công',
      data: sanitizedUsers,
    };
  }

  async getUserImage(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return { status: '404', message: 'Người dùng không tồn tại', data: null };
    }
    return {
      status: '200',
      message: 'Lấy ảnh người dùng thành công',
      data: user.image,
    };
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return { status: '404', message: 'Người dùng không tồn tại', data: null };
    }

    let additionalData = null;
    if (user.role === UserRole.DOCTOR) {
      additionalData = await this.doctorRepository.findOne({
        where: { user_id: id },
      });
    } else if (user.role === UserRole.PATIENT) {
      additionalData = await this.patientRepository.findOne({
        where: { user_id: id },
      });
    }

    const { password_hash, ...sanitizedUser } = user;
    return {
      status: '200',
      message: 'Lấy người dùng thành công',
      data: { ...sanitizedUser, details: additionalData },
    };
  }

  async updateUser(
    id: number,
    updateUserDto: Partial<User> & { details?: any },
  ) {
    const { full_name, phone_number, details } = updateUserDto;

    // Chỉ cập nhật các trường full_name và phone_number
    await this.userRepository.update(id, { full_name, phone_number });

    // Lấy thông tin user để kiểm tra role
    const user = await this.getUserById(id);
    if (!user.data) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    console.log(details)
    // Nếu có details, cập nhật thông tin dựa theo role
    if (details) {
      if (user.data.role === UserRole.DOCTOR) {
        // Chỉ cập nhật các trường được cung cấp
        const updateData: any = {};
        if (details.license_number !== undefined) updateData.license_number = details.license_number;
        if (details.gender !== undefined) updateData.gender = details.gender;
        if (details.specialty_id !== undefined) updateData.specialty_id = details.specialty_id;
        if (details.experience_years !== undefined) updateData.experience_years = details.experience_years;
        if (details.education !== undefined) updateData.education = details.education;
        if (details.workplace !== undefined) updateData.workplace = details.workplace;
        if (details.bio !== undefined) updateData.bio = details.bio;
        if (details.consultation_fee !== undefined) updateData.consultation_fee = details.consultation_fee;
        if (details.is_verified !== undefined) updateData.is_verified = details.is_verified;

        await this.doctorRepository
          .createQueryBuilder()
          .update(Doctor)
          .set(updateData)
          .where('user_id = :id', { id })
          .execute();
      } else if (user.data.role === UserRole.PATIENT) {
        await this.patientRepository.update({ user_id: id }, {
          date_of_birth: details.date_of_birth,
          gender: details.gender,
          medical_history: details.medical_history,
          allergies: details.allergies,
          blood_type: details.blood_type,
          height: details.height,
          weight: details.weight,
          descriptions: details.descriptions,
        });
      }
    }

    const updatedUser = await this.getUserById(id);
    return {
      status: '200',
      message: 'Cập nhật người dùng thành công',
      data: updatedUser.data,
    };
  }

  async updateUserImage(
    id: number,
    updateUserDto: Partial<User> & { details?: any },
  ) {
    // Lấy thông tin user để kiểm tra role
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }
    user.image = updateUserDto.image;
    await this.userRepository.save(user);

    console.log(user)

    return {
      status: '200',
      message: 'Cập nhật người dùng thành công',
      data: user,
    };
  }

  async deleteUser(id: number) {
    await this.userRepository.delete(id);
    return { status: '200', message: 'Xóa người dùng thành công', data: null };
  }

  async registerUser(body) {
  const { full_name, email, password, phone_number, image, role } = body;

  // Kiểm tra password
  if (!password) {
    throw new HttpException(
      'Mật khẩu không được để trống',
      HttpStatus.BAD_REQUEST,
    );
  }

  // Kiểm tra email đã tồn tại
  const existingUser = await this.getUserByEmail(email);
  if (existingUser) {
    throw new HttpException('Email đã tồn tại', HttpStatus.CONFLICT);
  }

  // Kiểm tra role hợp lệ
  if (!Object.values(UserRole).includes(role as UserRole)) {
    throw new HttpException('Vai trò không hợp lệ', HttpStatus.BAD_REQUEST);
  }

  // Mã hóa password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // CÁCH 1: Tạo user trước, sau đó tạo patient/doctor
  const newUser = this.userRepository.create({
    full_name,
    email,
    password_hash,
    phone_number,
    image,
    role: role as UserRole,
  });

  // Lưu user và đợi để có ID
  const savedUser = await this.userRepository.save(newUser);

  // Debug: Log ra để kiểm tra
  console.log('Saved user ID:', savedUser.id);

  // Kiểm tra ID có tồn tại không
  if (!savedUser.id) {
    throw new HttpException('Không thể tạo user', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // Tạo bản ghi theo role SAU KHI đã có user ID
  try {
    if (role === UserRole.PATIENT) {
      const newPatient = this.patientRepository.create({
        user_id: savedUser.id,
      });
      await this.patientRepository.save(newPatient);
      
    } else if (role === UserRole.DOCTOR) {
      const newDoctor = this.doctorRepository.create({
        user_id: savedUser.id,
      });
      await this.doctorRepository.save(newDoctor);
    }
  } catch (error) {
    // Nếu tạo patient/doctor lỗi, xóa user đã tạo
    await this.userRepository.delete(savedUser.id);
    throw error;
  }

  return {
    status: '201',
    message: 'Đăng ký thành công',
    data: { 
      id: savedUser.id, 
      full_name: savedUser.full_name, 
      email: savedUser.email, 
      image: savedUser.image, 
      phone_number: savedUser.phone_number, 
      role: savedUser.role 
    },
  };
}
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async loginUser(email: string, password: string) {
    // Tìm user theo email
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'Email hoặc mật khẩu không chính xác',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Kiểm tra trạng thái user
    if (user.status === UserStatus.INACTIVE) {
      throw new HttpException(
        'Tài khoản của bạn đã bị vô hiệu hóa',
        HttpStatus.FORBIDDEN,
      );
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new HttpException(
        'Email hoặc mật khẩu không chính xác',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Xác định thời điểm hết hạn: 23:59:59 hôm nay
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(23, 59, 59, 999);
    const expiresIn = Math.floor((midnight.getTime() - Date.now()) / 1000); // Đổi sang giây

    // Tạo token chứa thông tin user
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn },
    );

    // Trả về chỉ token
    return {
      status: '200',
      message: 'Đăng nhập thành công',
      data: {
        token,
      },
    };
  }

  async toggleUserStatus(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    // Toggle status giữa ACTIVE và INACTIVE
    user.status = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    await this.userRepository.save(user);

    return {
      status: '200',
      message: `Cập nhật trạng thái người dùng thành công`,
      data: user,
    };
  }
}
