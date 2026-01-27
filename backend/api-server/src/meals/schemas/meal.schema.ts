import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MealDocument = HydratedDocument<Meal>;

@Schema({ timestamps: true })
export class FoodItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: string;

  @Prop({ required: true })
  unit: string;

  @Prop()
  id?: string;

  @Prop({ type: Object, default: {} })
  micronutrients?: Record<string, number>;
}

@Schema({ timestamps: true })
export class Meal {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [FoodItem], default: [] })
  items: FoodItem[];

  @Prop({ default: 0 })
  calories: number;

  @Prop({ type: Object, default: {} })
  micronutrients?: Record<string, number>;

  @Prop({ required: true })
  date: Date;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
