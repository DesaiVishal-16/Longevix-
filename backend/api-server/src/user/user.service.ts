import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { User, UserDocument } from './schemas/user.schema';

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
}

interface ValidationErrorItem {
  message: string;
  path?: string;
  value?: unknown;
}

interface MongoValidationError extends Error {
  errors?: Record<string, ValidationErrorItem>;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModal: Model<UserDocument>) {}

  async createUser(registerUserDto: RegisterDto) {
    try {
      // Validate input DTO
      if (!registerUserDto) {
        throw new BadRequestException('Registration data is required');
      }

      // Create user
      const user = await this.userModal.create({
        username: registerUserDto.username,
        email: registerUserDto.email,
        password: registerUserDto.password,
      });

      return user;
    } catch (err) {
      // Log the error for debugging
      const error = err as Error;
      this.logger.error(
        `Error creating user: ${error.message}`,
        error.stack,
        'createUser',
      );

      // Handle MongoDB duplicate key error (E11000)
      const mongoError = err as MongoError;
      if (mongoError.code === 11000) {
        const field = Object.keys(mongoError.keyPattern || {})[0] || 'field';
        throw new ConflictException(`A user with this ${field} already exists`);
      }

      // Handle Mongoose validation errors
      if (err instanceof MongooseError.ValidationError) {
        const messages = Object.values(err.errors)
          .map((e) => e.message)
          .join(', ');
        throw new BadRequestException(`Validation failed: ${messages}`);
      }

      // Handle Mongoose cast errors (invalid data type)
      if (err instanceof MongooseError.CastError) {
        throw new BadRequestException(`Invalid ${err.path}: ${err.value}`);
      }

      // Handle document validation errors
      if (error.name === 'ValidationError') {
        const validationError = err as MongoValidationError;
        const messages = Object.values(validationError.errors || {})
          .map((e) => e.message)
          .join(', ');
        throw new BadRequestException(messages || 'Invalid data provided');
      }

      // Handle connection errors
      if (
        error.name === 'MongooseServerSelectionError' ||
        error.name === 'MongoNetworkError'
      ) {
        this.logger.error('Database connection error', error.stack);
        throw new InternalServerErrorException(
          'Database connection failed. Please try again later.',
        );
      }

      // Handle timeout errors
      if (error.name === 'MongooseTimeoutError') {
        throw new InternalServerErrorException(
          'Database operation timed out. Please try again.',
        );
      }

      // Handle NestJS HTTP exceptions (re-throw as-is)
      if ('status' in error && 'response' in error) {
        throw err;
      }

      // Handle out of memory errors
      if (err instanceof RangeError || error.message.includes('memory')) {
        this.logger.error('Memory error during user creation', error.stack);
        throw new InternalServerErrorException(
          'Unable to process request due to system constraints',
        );
      }

      // Handle null/undefined model errors
      if (!this.userModal) {
        this.logger.error('User model is not initialized');
        throw new InternalServerErrorException('Service configuration error');
      }

      // Catch-all for unexpected errors
      this.logger.error(
        `Unexpected error in createUser: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the user',
      );
    }
  }

  /**
   * Find user by email with error handling
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      if (!email) {
        throw new BadRequestException('Email is required');
      }

      return await this.userModal.findOne({ email }).exec();
    } catch (err) {
      const error = err as Error;
      this.logger.error(
        `Error finding user by email: ${error.message}`,
        error.stack,
      );

      if (err instanceof MongooseError.CastError) {
        throw new BadRequestException('Invalid email format');
      }

      if ('status' in error && 'response' in error) {
        throw err;
      }

      throw new InternalServerErrorException(
        'Error retrieving user information',
      );
    }
  }

  /**
   * Find user by ID with error handling
   */
  async findById(id: string): Promise<UserDocument | null> {
    try {
      if (!id) {
        throw new BadRequestException('User ID is required');
      }

      return await this.userModal.findById(id).exec();
    } catch (err) {
      const error = err as Error;
      this.logger.error(
        `Error finding user by ID: ${error.message}`,
        error.stack,
      );

      if (err instanceof MongooseError.CastError) {
        throw new BadRequestException('Invalid user ID format');
      }

      if ('status' in error && 'response' in error) {
        throw err;
      }

      throw new InternalServerErrorException(
        'Error retrieving user information',
      );
    }
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return await this.userModal.findOne({ _id: id }).exec();
  }
}
