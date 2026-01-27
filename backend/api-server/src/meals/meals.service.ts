import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FoodItem, Meal, MealDocument } from './schemas/meal.schema';

@Injectable()
export class MealsService {
  constructor(@InjectModel(Meal.name) private mealModel: Model<MealDocument>) {}

  async createMeal(userId: string, mealName: string, foodItems: FoodItem[]): Promise<Meal> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    
    let totalCalories = 0;
    const totalMicronutrients: Record<string, number> = {};
    
    foodItems.forEach(item => {
      totalCalories += 150;
      
      
      if (item.micronutrients) {
        Object.entries(item.micronutrients).forEach(([key, value]) => {
          if (!totalMicronutrients[key]) {
            totalMicronutrients[key] = 0;
          }
          totalMicronutrients[key] += value;
        });
      }
    });

    
    let existingMeal = await this.mealModel.findOne({
      userId,
      name: mealName,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingMeal) {
      
      existingMeal.items = [...existingMeal.items, ...foodItems];
      existingMeal.calories += totalCalories;
      
      
      if (!existingMeal.micronutrients) {
        existingMeal.micronutrients = {};
      }
      
      Object.entries(totalMicronutrients).forEach(([key, value]) => {
        if (!existingMeal.micronutrients![key]) {
          existingMeal.micronutrients![key] = 0;
        }
        existingMeal.micronutrients![key] += value;
      });
      
      return existingMeal.save();
    }

    
    const newMeal = new this.mealModel({
      userId,
      name: mealName,
      items: foodItems,
      calories: totalCalories,
      micronutrients: totalMicronutrients,
      date: today,
    });

    return newMeal.save();
  }

  async getMealsByDate(userId: string, date: Date): Promise<Meal[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    return this.mealModel.find({
      userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).exec();
  }

  async getMealById(userId: string, mealId: string): Promise<Meal | null> {
    return this.mealModel.findOne({
      _id: mealId,
      userId,
    }).exec();
  }

  async addFoodToMeal(userId: string, mealName: string, foodItem: FoodItem): Promise<Meal> {
    return this.createMeal(userId, mealName, [foodItem]);
  }

  async removeFoodFromMeal(userId: string, mealId: string, foodId: string): Promise<Meal> {
    const meal = await this.mealModel.findOne({
      _id: mealId,
      userId,
    });

    if (!meal) {
      throw new Error('Meal not found');
    }

    meal.items = meal.items.filter(item => item.id !== foodId);
    meal.calories -= 150;
    return meal.save();
  }
}
