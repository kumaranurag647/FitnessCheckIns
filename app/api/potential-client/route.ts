import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      email,
      fullName,
      phoneNumber,
      gender,
      age,
      profession,
      location,
      goal,
      investment,
      preferredPlan,
    } = body;

    // Validate required fields
    if (
      !email ||
      !fullName ||
      !phoneNumber ||
      !gender ||
      !age ||
      !profession ||
      !location ||
      !goal ||
      !investment ||
      !preferredPlan
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("potential_client")
      .insert([
        {
          email,
          full_name: fullName,
          phone_number: phoneNumber,
          gender,
          age: parseInt(age),
          profession,
          location,
          goal,
          investment_budget: investment === "yes",
          preferred_plan: preferredPlan,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save potential client data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Potential client form submitted successfully", data },
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
