import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Create Supabase client with service role key for API routes (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
}

const supabase = createClient(
  supabaseUrl || "",
  supabaseServiceKey || ""
);

export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error: Missing Supabase keys" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    let builder = supabase.from("checkins").select("*").order("created_at", {
      ascending: false,
    });

    if (query) {
      builder = builder.ilike("name", `%${query}%`);
    }

    const { data, error } = await builder;

    if (error) {
      console.error("Supabase read error:", error);
      return NextResponse.json(
        { error: "Failed to load client check-ins" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error: Missing Supabase keys" },
        { status: 500 }
      );
    }

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
