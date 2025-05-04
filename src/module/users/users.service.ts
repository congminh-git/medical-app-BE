import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';
import { Patient } from '../patients/patients.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Doctor } from '../doctors/doctors.entity';

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
        await this.doctorRepository.update(
          { user_id: id },
          {
            license_number: details.license_number,
            gender: details.gender,
            specialty_id: details.specialty_id,
            experience_years: details.experience_years,
            education: details.education,
            workplace: details.workplace,
            bio: details.bio,
            consultation_fee: details.consultation_fee,
            is_verified: details.is_verified,
          },
        );
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

    if (!password) {
      throw new HttpException(
        'Mật khẩu không được để trống',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new HttpException('Email đã tồn tại', HttpStatus.CONFLICT);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new HttpException('Vai trò không hợp lệ', HttpStatus.BAD_REQUEST);
    }

    // Tạo user mới
    const newUser = this.userRepository.create({
      full_name,
      email,
      password_hash,
      phone_number,
      image,
      role: role as UserRole,
    });

    await this.userRepository.save(newUser);

    // Nếu role là "patient", tạo một bản ghi trong bảng patients
    if (role === UserRole.PATIENT) {
      const newPatient = this.patientRepository.create({
        user_id: newUser.id, // Liên kết với user vừa tạo
      });

      await this.patientRepository.save(newPatient);
    } else if (role === UserRole.DOCTOR) {
      const newDoctor = this.doctorRepository.create({
        user_id: newUser.id, // Liên kết với user vừa tạo
      });
      await this.doctorRepository.save(newDoctor);
    }

    return {
      status: '201',
      message: 'Đăng ký thành công',
      data: { id: newUser.id, full_name, email, image, phone_number, role },
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
}
