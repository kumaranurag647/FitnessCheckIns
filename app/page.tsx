"use client";

import { useState } from "react";

const SOUTH_DELHI_AREAS = [
  "Chattarpur",
  "Chhatarpur Pahari",
  "Defence Colony",
  "East of Kailash",
  "Greater Kailash",
  "Greater Kailash I",
  "Greater Kailash II",
  "Hauz Khas",
  "Kalkaji",
  "Lajpat Nagar",
  "Malviya Nagar",
  "Mehrauli",
  "Nehru Place",
  "Safdarjung Enclave",
  "Saket",
  "Vasant Kunj",
];

const GOAL_OPTIONS = {
  male: [
    "Lean aesthetic model look",
    "Fat loss for nearby function or trip",
  ],
  female: [
    "Toned model look",
    "Fat loss for nearby function or trip",
  ],
};

const PLAN_OPTIONS = [
  "Online Consultancy",
  "Personal sessions",
  "Hybrid plan",
];

export default function CheckIn() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    gender: "",
    age: "",
    profession: "",
    location: "",
    goal: "",
    investment: "",
    preferredPlan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/[-\s]/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18) {
      newErrors.age = "Please enter a valid age (18+)";
    }

    if (!formData.profession.trim()) {
      newErrors.profession = "Profession is required";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    if (!formData.goal) {
      newErrors.goal = "Goal is required";
    }

    if (!formData.investment) {
      newErrors.investment = "Investment question must be answered";
    }

    if (!formData.preferredPlan) {
      newErrors.preferredPlan = "Preferred plan is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/potential-client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit form");
      }

      setSuccess(true);
      setFormData({
        email: "",
        fullName: "",
        phoneNumber: "",
        gender: "",
        age: "",
        profession: "",
        location: "",
        goal: "",
        investment: "",
        preferredPlan: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Get available goals based on selected gender
  const availableGoals =
    formData.gender === "male"
      ? GOAL_OPTIONS.male
      : formData.gender === "female"
        ? GOAL_OPTIONS.female
        : [];

  return (
    <main className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 rounded-[32px] p-10 shadow-2xl">
        
        {/* HEADER */}
        <div className="mb-12 flex flex-col items-center text-center">
          
          {/* LOGO */}
          <img
            src="/TeamPremLogoNoBG.png"
            alt="Team Prem Logo"
            className="w-32 md:w-40 object-contain -mb-2"
          />

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
            Unrecognisable in 3 Months
          </h1>

          {/* SUBTITLE */}
          <p className="text-zinc-400 mt-3 text-base max-w-md">
            Tell us about yourself to get started on your fitness journey
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-300 font-medium">
              ✓ Check-in submitted successfully! Our team will contact you soon.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 font-medium">✗ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border outline-none transition duration-300 text-white placeholder-zinc-500 ${
                errors.email ? "border-red-500" : "border-zinc-700 focus:border-white"
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-zinc-300 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border outline-none transition duration-300 text-white placeholder-zinc-500 ${
                errors.fullName ? "border-red-500" : "border-zinc-700 focus:border-white"
              }`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-zinc-300 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border outline-none transition duration-300 text-white placeholder-zinc-500 ${
                errors.phoneNumber ? "border-red-500" : "border-zinc-700 focus:border-white"
              }`}
              placeholder="9876543210"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Gender and Age Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-zinc-300 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border outline-none transition duration-300 text-white ${
                  errors.gender ? "border-red-500" : "border-zinc-700 focus:border-white"
                }`}
              >
                <option value="" className="bg-zinc-900">Select Gender</option>
                <option value="male" className="bg-zinc-900">Male</option>
                <option value="female" className="bg-zinc-900">Female</option>
                <option value="other" className="bg-zinc-900">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-400">{errors.gender}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-zinc-300 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border outline-none transition duration-300 text-white placeholder-zinc-500 ${
                  errors.age ? "border-red-500" : "border-zinc-700 focus:border-white"
                }`}
                placeholder="25"
                min="18"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-400">{errors.age}</p>
              )}
            </div>
          </div>

          {/* Profession */}
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-zinc-300 mb-2">
              Profession <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border outline-none transition duration-300 text-white placeholder-zinc-500 ${
                errors.profession ? "border-red-500" : "border-zinc-700 focus:border-white"
              }`}
              placeholder="e.g., Software Engineer"
            />
            {errors.profession && (
              <p className="mt-1 text-sm text-red-400">{errors.profession}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-2">
              Location (South Delhi) <span className="text-red-500">*</span>
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border outline-none transition duration-300 text-white ${
                errors.location ? "border-red-500" : "border-zinc-700 focus:border-white"
              }`}
            >
              <option value="" className="bg-zinc-900">Select Location</option>
              {SOUTH_DELHI_AREAS.map((area) => (
                <option key={area} value={area} className="bg-zinc-900">
                  {area}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="mt-1 text-sm text-red-400">{errors.location}</p>
            )}
          </div>

          {/* Goal */}
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-zinc-300 mb-2">
              Fitness Goal <span className="text-red-500">*</span>
            </label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              disabled={!formData.gender}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border outline-none transition duration-300 text-white ${
                errors.goal ? "border-red-500" : "border-zinc-700 focus:border-white"
              } ${!formData.gender ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="" className="bg-zinc-900">
                {formData.gender ? "Select Goal" : "Please select gender first"}
              </option>
              {availableGoals.map((goal) => (
                <option key={goal} value={goal} className="bg-zinc-900">
                  {goal}
                </option>
              ))}
            </select>
            {errors.goal && (
              <p className="mt-1 text-sm text-red-400">{errors.goal}</p>
            )}
          </div>

          {/* Investment Question */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Will you be able to invest 30-50K on yourself for the next 3 months?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="investment"
                  value="yes"
                  checked={formData.investment === "yes"}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4 accent-white"
                />
                <span className="text-zinc-300">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="investment"
                  value="no"
                  checked={formData.investment === "no"}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4 accent-white"
                />
                <span className="text-zinc-300">No</span>
              </label>
            </div>
            {errors.investment && (
              <p className="mt-2 text-sm text-red-400">{errors.investment}</p>
            )}
          </div>

          {/* Preferred Plan */}
          <div>
            <label htmlFor="preferredPlan" className="block text-sm font-medium text-zinc-300 mb-2">
              Preferred Plan <span className="text-red-500">*</span>
            </label>
            <select
              id="preferredPlan"
              name="preferredPlan"
              value={formData.preferredPlan}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border outline-none transition duration-300 text-white ${
                errors.preferredPlan ? "border-red-500" : "border-zinc-700 focus:border-white"
              }`}
            >
              <option value="" className="bg-zinc-900">Select Plan</option>
              {PLAN_OPTIONS.map((plan) => (
                <option key={plan} value={plan} className="bg-zinc-900">
                  {plan}
                </option>
              ))}
            </select>
            {errors.preferredPlan && (
              <p className="mt-1 text-sm text-red-400">{errors.preferredPlan}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-lg border border-white/20 bg-white py-3 text-base font-semibold text-black transition-all duration-300 hover:scale-[1.01] hover:bg-zinc-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative z-10">
              {loading ? "Submitting..." : "Apply Now"}
            </span>
          </button>
        </form>
      </div>
    </main>
  );
}