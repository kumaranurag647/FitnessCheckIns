"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    weight: "",

    height_feet: "",
    height_inches: "",

    chest: "",
    arms: "",
    thighs: "",
    calves: "",
    waist: "",

    goal: "",

    diet_type: "",
    food_preferences: "",
    food_allergies: "",

    medical_conditions: "",
    injuries: "",
    anabolic_history: "",

    daily_routine: "",
  });

  const [images, setImages] = useState<any>({
    front: null,
    left: null,
    right: null,
    back: null,
  });

  const feetOptions = [3, 4, 5, 6, 7, 8];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name)
      newErrors.name =
        "Please add your full name";

    if (!formData.email)
      newErrors.email =
        "Please add your email address";

    if (!formData.age)
      newErrors.age =
        "Please add your age";

    if (!formData.weight)
      newErrors.weight =
        "Please add your weight";

    if (!formData.height_feet)
      newErrors.height_feet =
        "Please add your height in feet";

    if (!formData.height_inches)
      newErrors.height_inches =
        "Please add your height in inches";

    if (!formData.chest)
      newErrors.chest =
        "Please add your chest measurement";

    if (!formData.arms)
      newErrors.arms =
        "Please add your arms measurement";

    if (!formData.thighs)
      newErrors.thighs =
        "Please add your thighs measurement";

    if (!formData.calves)
      newErrors.calves =
        "Please add your calves measurement";

    if (!formData.waist)
      newErrors.waist =
        "Please add your waist measurement";

    if (!formData.goal)
      newErrors.goal =
        "Please add your fitness goal";

    if (!formData.diet_type)
      newErrors.diet_type =
        "Please select your diet type";

    if (!formData.food_preferences)
      newErrors.food_preferences =
        "Please add your food preferences";

    if (!formData.food_allergies)
      newErrors.food_allergies =
        "Please add your food allergies";

    if (!formData.medical_conditions)
      newErrors.medical_conditions =
        "Please add your medical conditions";

    if (!formData.injuries)
      newErrors.injuries =
        "Please add your injury history";

    if (!formData.anabolic_history)
      newErrors.anabolic_history =
        "Please add your anabolic history";

    if (!formData.daily_routine)
      newErrors.daily_routine =
        "Please add your daily routine";

    if (!images.front)
      newErrors.front =
        "Please upload front relaxed photo";

    if (!images.left)
      newErrors.left =
        "Please upload left side photo";

    if (!images.right)
      newErrors.right =
        "Please upload right side photo";

    if (!images.back)
      newErrors.back =
        "Please upload back relaxed photo";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (
    file: File,
    path: string
  ) => {
    const { error } = await supabase.storage
      .from("checkins")
      .upload(path, file);

    if (error) {
      console.log(error);
      return null;
    }

    const { data } = supabase.storage
      .from("checkins")
      .getPublicUrl(path);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const frontUrl = images.front
      ? await uploadImage(
        images.front,
        `front-${Date.now()}`
      )
      : "";

    const leftUrl = images.left
      ? await uploadImage(
        images.left,
        `left-${Date.now()}`
      )
      : "";

    const rightUrl = images.right
      ? await uploadImage(
        images.right,
        `right-${Date.now()}`
      )
      : "";

    const backUrl = images.back
      ? await uploadImage(
        images.back,
        `back-${Date.now()}`
      )
      : "";

    const { error } = await supabase
      .from("checkins")
      .insert([
        {
          ...formData,

          front_image: frontUrl,
          left_image: leftUrl,
          right_image: rightUrl,
          back_image: backUrl,
        },
      ]);

    if (error) {
      console.log(error);
      alert("Something went wrong");
    } else {
      alert("Check-In Submitted Successfully");

      setFormData({
        name: "",
        email: "",
        age: "",
        weight: "",

        height_feet: "",
        height_inches: "",

        chest: "",
        arms: "",
        thighs: "",
        calves: "",
        waist: "",

        goal: "",

        diet_type: "",
        food_preferences: "",
        food_allergies: "",

        medical_conditions: "",
        injuries: "",
        anabolic_history: "",

        daily_routine: "",
      });

      setImages({
        front: null,
        left: null,
        right: null,
        back: null,
      });
    }

    setLoading(false);
  };

  const inputClass = (field: string) =>
    `w-full p-4 rounded-2xl bg-zinc-900 border outline-none transition duration-300 ${errors[field]
      ? "border-red-500"
      : "border-zinc-700 focus:border-white"
    }`;

  return (
    <main className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-3xl mx-auto bg-zinc-950 border border-zinc-800 rounded-[32px] p-10 shadow-2xl">

        {/* HEADER */}

        <div className="mb-14 flex flex-col items-center text-center">

          {/* LOGO */}

          <img
            src="/TeamPremLogoNoBG.png"
            alt="Team Prem Logo"
            className="w-40 md:w-52 object-contain -mt-5 -mb-5"
          />

          {/* TITLE */}

          <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
            Client Check-Ins
          </h1>

          {/* SUBTITLE */}

          <p className="text-zinc-400 mt-4 text-lg max-w-lg">
            Fill in your physique and lifestyle details accurately.
          </p>

        </div>

        <div className="space-y-12">

          {/* BASIC INFO */}

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-3">
              Basic Information
            </h2>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={inputClass("email")}
              />

              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email}
                </p>
              )}
            </div>
            {/* NAME */}

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={inputClass("name")}
              />

              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="space-y-2">
                <label className="text-sm text-zinc-300">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  className={inputClass("age")}
                />

                {errors.age && (
                  <p className="text-red-500 text-sm">
                    {errors.age}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-300">
                  Weight (kg)
                </label>

                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Enter weight"
                  className={inputClass("weight")}
                />

                {errors.weight && (
                  <p className="text-red-500 text-sm">
                    {errors.weight}
                  </p>
                )}
              </div>

            </div>
          </section>

          {/* HEIGHT */}

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-3">
              Height
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="space-y-2">
                <label className="text-sm text-zinc-300">
                  Feet
                </label>

                <input
                  list="feet-options"
                  name="height_feet"
                  value={formData.height_feet}
                  onChange={handleChange}
                  placeholder="Select feet"
                  className={inputClass("height_feet")}
                />

                <datalist id="feet-options">
                  {feetOptions.map((item) => (
                    <option
                      key={item}
                      value={`${item} ft`}
                    />
                  ))}
                </datalist>

                {errors.height_feet && (
                  <p className="text-red-500 text-sm">
                    {errors.height_feet}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-300">
                  Inches
                </label>

                <input
                  list="height-inch-options"
                  name="height_inches"
                  value={formData.height_inches}
                  onChange={handleChange}
                  placeholder="Select inches"
                  className={inputClass("height_inches")}
                />

                <datalist id="height-inch-options">
                  {Array.from({ length: 12 }, (_, i) => i).map((item) => (
                    <option
                      key={item}
                      value={`${item} in`}
                    />
                  ))}
                </datalist>

                {errors.height_inches && (
                  <p className="text-red-500 text-sm">
                    {errors.height_inches}
                  </p>
                )}
              </div>

            </div>
          </section>

          {/* MEASUREMENTS */}

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-3">
              Measurements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {[
                ["chest", "Chest"],
                ["arms", "Arms"],
                ["thighs", "Thighs"],
                ["calves", "Calves"],
                ["waist", "Waist"],
              ].map(([name, label]) => (
                <div
                  key={name}
                  className="space-y-2"
                >
                  <label className="text-sm text-zinc-300">
                    {label} (inches)
                  </label>

                  <input
                    type="number"
                    name={name}
                    value={
                      formData[
                      name as keyof typeof formData
                      ]
                    }
                    onChange={handleChange}
                    placeholder={`Enter ${label.toLowerCase()} size`}
                    className={inputClass(name)}
                  />

                  {errors[name] && (
                    <p className="text-red-500 text-sm">
                      {errors[name]}
                    </p>
                  )}
                </div>
              ))}

            </div>
          </section>

          {/* GOAL */}

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-3 mb-4">
              Fitness Goal
            </h2>

            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="Describe your goal..."
              className={inputClass("goal")}
            />

            {errors.goal && (
              <p className="text-red-500 text-sm">
                {errors.goal}
              </p>
            )}
          </section>

          {/* FOOD */}

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-3">
              Food Preferences
            </h2>

            <div className="space-y-2">
              <select
                name="diet_type"
                value={formData.diet_type}
                onChange={handleChange}
                className={inputClass("diet_type")}
              >
                <option value="">
                  Select diet type
                </option>

                <option value="Vegetarian">
                  Vegetarian
                </option>

                <option value="Non-Vegetarian">
                  Non-Vegetarian
                </option>
              </select>

              {errors.diet_type && (
                <p className="text-red-500 text-sm">
                  {errors.diet_type}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <textarea
                name="food_preferences"
                value={formData.food_preferences}
                onChange={handleChange}
                placeholder="Food likes/dislikes..."
                className={inputClass("food_preferences")}
              />

              {errors.food_preferences && (
                <p className="text-red-500 text-sm">
                  {errors.food_preferences}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <textarea
                name="food_allergies"
                value={formData.food_allergies}
                onChange={handleChange}
                placeholder="Food allergies..."
                className={inputClass("food_allergies")}
              />

              {errors.food_allergies && (
                <p className="text-red-500 text-sm">
                  {errors.food_allergies}
                </p>
              )}
            </div>
          </section>

          {/* MEDICAL */}

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-3">
              Medical & Injury History
            </h2>

            {[
              [
                "medical_conditions",
                "Current or previous medical conditions...",
              ],
              [
                "injuries",
                "Current or previous injuries...",
              ],
              [
                "anabolic_history",
                "Previous anabolic history...",
              ],
            ].map(([name, placeholder]) => (
              <div
                key={name}
                className="space-y-2"
              >
                <textarea
                  name={name}
                  value={
                    formData[
                    name as keyof typeof formData
                    ]
                  }
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={inputClass(name)}
                />

                {errors[name] && (
                  <p className="text-red-500 text-sm">
                    {errors[name]}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* DAILY ROUTINE */}

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-3 mb-4">
              Daily Routine
            </h2>

            <textarea
              name="daily_routine"
              value={formData.daily_routine}
              onChange={handleChange}
              placeholder="Wakeup time, work timings, lunch break and workout timings..."
              className={inputClass("daily_routine")}
            />

            {errors.daily_routine && (
              <p className="text-red-500 text-sm">
                {errors.daily_routine}
              </p>
            )}
          </section>

          {/* CHECK-IN PHOTOS */}

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-3">
              Check-In Photos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {[
                ["front", "Front Relaxed"],
                ["left", "Left Side"],
                ["right", "Right Side"],
                ["back", "Back Relaxed"],
              ].map(([key, label]) => (
                <div key={key}>

                  <input
                    id={`upload-${key}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      setImages({
                        ...images,
                        [key]: e.target.files?.[0],
                      });

                      setErrors({
                        ...errors,
                        [key]: "",
                      });
                    }}
                  />

                  {!images[key] ? (

                    <div
                      onClick={() =>
                        document
                          .getElementById(`upload-${key}`)
                          ?.click()
                      }
                      className={`cursor-pointer border border-dashed rounded-3xl p-8 bg-zinc-900 transition duration-300 hover:bg-zinc-800 hover:scale-[1.01] ${errors[key]
                          ? "border-red-500"
                          : "border-zinc-700 hover:border-white"
                        }`}
                    >

                      <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[260px]">

                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                          <Upload className="w-7 h-7 text-white" />
                        </div>

                        <div>
                          <p className="font-semibold text-2xl">
                            {label}
                          </p>

                          <p className="text-sm text-zinc-400 mt-2">
                            Click to upload photo
                          </p>
                        </div>

                      </div>

                    </div>

                  ) : (

                    <div className="border border-zinc-700 rounded-3xl bg-zinc-900 overflow-hidden">

                      {/* IMAGE PREVIEW */}

                      <div className="relative h-[260px]">

                        <img
                          src={URL.createObjectURL(images[key])}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute top-4 right-4 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                          Uploaded
                        </div>

                      </div>

                      {/* FOOTER */}

                      <div className="p-5 space-y-4">

                        <div>
                          <p className="font-semibold text-lg">
                            {label}
                          </p>

                          <p className="text-sm text-zinc-400 truncate mt-1">
                            {images[key]?.name}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            document
                              .getElementById(`upload-${key}`)
                              ?.click()
                          }
                          className="w-full rounded-2xl bg-white text-black py-3 font-medium hover:bg-zinc-200 transition"
                        >
                          Reupload Photo
                        </button>

                      </div>

                    </div>

                  )}

                  {errors[key] && (
                    <p className="text-red-500 text-sm mt-2 text-center">
                      {errors[key]}
                    </p>
                  )}

                </div>
              ))}

            </div>
          </section>
          {/* SUBMIT BUTTON */}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-2xl border border-white/20 bg-white py-5 text-lg font-semibold text-black transition-all duration-300 hover:scale-[1.01] hover:bg-zinc-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-[0.99]"
          >

            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="relative z-10 tracking-wide">
              {loading
                ? "Submitting..."
                : "Submit Check-In"}
            </span>

          </button>

        </div>
      </div>
    </main>
  );
}