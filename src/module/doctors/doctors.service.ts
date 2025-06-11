import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctors.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async findAll(): Promise<any[]> {
    return await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .select([
        'doctor',
        'user.full_name',
        'user.email',
        'user.phone_number',
        'user.image',
      ])
      .getMany();
  }

  async findOne(id: number): Promise<any | null> {
    return await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .select([
        'doctor',
        'user.full_name',
        'user.email',
        'user.phone_number',
        'user.image',
      ])
      .where('doctor.user_id = :id', { id })
      .getOne();
  }

  async findTopNew(recommendation?: string): Promise<any[]> {
    // Khởi tạo query builder cơ bản với các trường cần thiết
    const baseQuery = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .select([
        'doctor',
        'user.full_name',
        'user.email',
        'user.phone_number',
        'user.created_at',
        'user.image',
      ]);

    // Kiểm tra nếu có danh sách đề xuất
    if (recommendation) {
      // Chuyển đổi chuỗi recommendation thành mảng các số nguyên user_id
      const recommendedUserIds = recommendation
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id)); // Lọc bỏ các giá trị không hợp lệ

      let recommendedDoctors: any[] = [];
      let fetchedDoctorUserIds: number[] = [];

      // Bước 1: Lấy các bác sĩ dựa trên danh sách đề xuất
      if (recommendedUserIds.length > 0) {
        recommendedDoctors = await baseQuery
          .clone() // Clone query builder để không ảnh hưởng đến các truy vấn tiếp theo
          .andWhere('user.id IN (:...recommendedUserIds)', {
            recommendedUserIds,
          })
          .orderBy('RANDOM()') // Lấy các bác sĩ được đề xuất một cách ngẫu nhiên
          .limit(4) // Chỉ lấy tối đa 4 bác sĩ từ danh sách đề xuất
          .getMany();

        // Lấy danh sách user_id của các bác sĩ đã được tìm thấy để loại trừ sau này
        fetchedDoctorUserIds = recommendedDoctors.map(
          (doctor) => doctor.user.id,
        );
      }

      // Tính số lượng bác sĩ cần bổ sung
      const remainingCount = 4 - recommendedDoctors.length;

      // Bước 2: Bổ sung các bác sĩ ngẫu nhiên nếu số lượng chưa đủ 4
      if (remainingCount > 0) {
        const newDoctors = await baseQuery
          .clone() // Clone query builder một lần nữa
          .orderBy('RANDOM()')
          .limit(remainingCount) // Giới hạn số lượng bác sĩ cần bổ sung
          .getMany();

        // Kết hợp danh sách bác sĩ được đề xuất và bác sĩ ngẫu nhiên
        return [...recommendedDoctors, ...newDoctors];
      } else {
        // Nếu đã tìm thấy đủ hoặc hơn 4 bác sĩ từ danh sách đề xuất, trả về 4 bác sĩ đầu tiên
        return recommendedDoctors;
      }
    } else {
      // Nếu không có recommendation, trả về 4 bác sĩ ngẫu nhiên
      return await baseQuery
        .orderBy('RANDOM()') // Sắp xếp ngẫu nhiên
        .limit(4)
        .getMany();
    }
  }

  async create(doctorData: Partial<Doctor>): Promise<Doctor> {
    const doctor = this.doctorRepository.create(doctorData);
    return await this.doctorRepository.save(doctor);
  }

  async update(id: number, doctorData: Partial<Doctor>): Promise<Doctor> {
    // Chỉ cập nhật các trường được cung cấp
    const updateData: any = {};
    if (doctorData.license_number !== undefined) updateData.license_number = doctorData.license_number;
    if (doctorData.gender !== undefined) updateData.gender = doctorData.gender;
    if (doctorData.specialty_id !== undefined) updateData.specialty_id = doctorData.specialty_id;
    if (doctorData.experience_years !== undefined) updateData.experience_years = doctorData.experience_years;
    if (doctorData.education !== undefined) updateData.education = doctorData.education;
    if (doctorData.workplace !== undefined) updateData.workplace = doctorData.workplace;
    if (doctorData.bio !== undefined) updateData.bio = doctorData.bio;
    if (doctorData.consultation_fee !== undefined) updateData.consultation_fee = doctorData.consultation_fee;
    if (doctorData.is_verified !== undefined) updateData.is_verified = doctorData.is_verified;

    await this.doctorRepository
      .createQueryBuilder()
      .update(Doctor)
      .set(updateData)
      .where('user_id = :id', { id })
      .execute();
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.doctorRepository.delete(id);
  }
}
