from app.schemas import (
    ChatRequest,
    ChatResponse,
    GenerateNutrientsRequest,
    GenerateNutrientsResponse,
)
from fastapi import FastAPI

app = FastAPI(title="AI Inference Service")


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        from app.model import generate_text

        prompt = f"You are a nutrition coach. Answer the following question about nutrition concisely and accurately: {req.message}"
        response = generate_text(prompt, max_tokens=200)
        return {"response": response.strip()}
    except Exception as e:
        print(f"Error calling AI model: {e}")
        return {"response": f"This is a response to your question: {req.message}"}


@app.post("/generate-nutrients", response_model=GenerateNutrientsResponse)
def generate_nutrients(req: GenerateNutrientsRequest):
    total_calories = 0.0
    total_fat = 0.0
    total_protein = 0.0
    total_carbs = 0.0
    items_with_nutrients = []

    UNIT_CONVERSIONS = {
        "g": 1,
        "mg": 0.001,
        "ml": 1,
        "cup": 240,
        "glass": 250,
        "katori": 150,
        "bowl": 250,
        "tsp": 5,
        "tbsp": 15,
    }

    PIECE_WEIGHTS = {
        "egg": 50,
        "banana": 120,
        "apple": 180,
        "roti": 30,
    }

    for food in req.food:
        item_calories = 150
        item_fat = 5
        item_protein = 10
        item_carbs = 20

        quantity = float(food.quantity)
        unit = food.unit.lower() if food.unit else "g"

        if unit == "pcs":
            grams_per_piece = PIECE_WEIGHTS.get(food.name.lower(), 100)
            grams = quantity * grams_per_piece
        else:
            grams = quantity * UNIT_CONVERSIONS.get(unit, 1)

        multiplier = grams / 100

        calories = item_calories * multiplier
        fat = item_fat * multiplier
        protein = item_protein * multiplier
        carbs = item_carbs * multiplier

        total_calories += calories
        total_fat += fat
        total_protein += protein
        total_carbs += carbs

        items_with_nutrients.append(
            {
                "name": food.name,
                "quantity": quantity,
                "unit": unit,
                "calories": round(calories, 2),
                "fat": round(fat, 2),
                "protein": round(protein, 2),
                "carbohydrates": round(carbs, 2),
                "micronutrients": {
                    "vitamin_c": round(50 * multiplier, 2),
                    "iron": round(5 * multiplier, 2),
                    "calcium": round(100 * multiplier, 2),
                    "vitamin_d": round(2 * multiplier, 2),
                    "vitamin_a": round(800 * multiplier, 2),
                    "vitamin_b12": round(1.5 * multiplier, 2),
                    "vitamin_b6": round(1.3 * multiplier, 2),
                    "folate": round(200 * multiplier, 2),
                    "magnesium": round(80 * multiplier, 2),
                    "potassium": round(300 * multiplier, 2),
                    "zinc": round(5 * multiplier, 2),
                    "selenium": round(20 * multiplier, 2),
                    "copper": round(0.5 * multiplier, 2),
                    "manganese": round(1 * multiplier, 2),
                    "iodine": round(50 * multiplier, 2),
                },
            }
        )

    return {
        "total": {
            "calories": round(total_calories, 2),
            "fat": round(total_fat, 2),
            "protein": round(total_protein, 2),
            "carbohydrates": round(total_carbs, 2),
            "micronutrients": {
                "vitamin_c": round(total_calories * 0.02, 2),
                "iron": round(total_calories * 0.05, 2),
                "calcium": round(total_calories * 0.1, 2),
                "vitamin_d": round(total_calories * 0.001, 2),
                "vitamin_a": round(total_calories * 0.3, 2),
                "vitamin_b12": round(total_calories * 0.0005, 2),
                "vitamin_b6": round(total_calories * 0.0005, 2),
                "folate": round(total_calories * 0.08, 2),
                "magnesium": round(total_calories * 0.03, 2),
                "potassium": round(total_calories * 0.12, 2),
                "zinc": round(total_calories * 0.02, 2),
                "selenium": round(total_calories * 0.008, 2),
                "copper": round(total_calories * 0.0002, 2),
                "manganese": round(total_calories * 0.0004, 2),
                "iodine": round(total_calories * 0.02, 2),
            },
        },
        "items": items_with_nutrients,
    }
