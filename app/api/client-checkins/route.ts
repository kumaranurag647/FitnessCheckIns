import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      age,
      weight,
      height_feet,
      height_inches,
      chest,
      arms,
      thighs,
      calves,
      waist,
      goal,
      diet_type,
      food_preferences,
      food_allergies,
      medical_conditions,
      injuries,
      anabolic_history,
      daily_routine,
      front_image,
      left_image,
      right_image,
      back_image,
    } = body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !age ||
      !weight ||
      !height_feet ||
      !height_inches ||
      !chest ||
      !arms ||
      !thighs ||
      !calves ||
      !waist ||
      !goal ||
      !diet_type ||
      !food_preferences ||
      !food_allergies ||
      !medical_conditions ||
      !injuries ||
      !anabolic_history ||
      !daily_routine ||
      !front_image ||
      !left_image ||
      !right_image ||
      !back_image
    ) {
      return NextResponse.json(
        { error: "All fields including images are required" },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("checkins")
      .insert([
        {
          name,
          email,
          age: parseInt(age),
          weight,
          height_feet,
          height_inches,
          chest,
          arms,
          thighs,
          calves,
          waist,
          goal,
          diet_type,
          food_preferences,
          food_allergies,
          medical_conditions,
          injuries,
          anabolic_history,
          daily_routine,
          front_image,
          left_image,
          right_image,
          back_image,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save client check-in data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Client check-in submitted successfully", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
