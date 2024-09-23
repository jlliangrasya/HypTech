import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Text, Heading } from "../../../components";
import { useNavigate, useLocation } from "react-router-dom";

export default function BHRegistration() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve owner ID from the navigation state
  const ownerId = location.state?.ownerId || "defaultOwnerIdIfNoneProvided";

  // State to hold form data
  const [formData, setFormData] = useState({
    bhname: "",
    bhaddress: "",
    bhrooms: "",
    owner: ownerId,
  });

  const capitalizeEachWord = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Capitalize each word in the bhname
    const formattedBhname = capitalizeEachWord(formData.bhname);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/boardinghouse/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bhname: formattedBhname,
          bhaddress: formData.bhaddress,
          bhrooms: formData.bhrooms,
          owner: formData.owner, // Include the owner field
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const boardingHouseId = responseData.id; // Assuming the response contains the ID of the new boarding house
        console.log("BH data saved successfully:", responseData);
        navigate("/bhinfo", {
          state: {
            bhrooms: formData.bhrooms,
            boardingHouseId,
            bhname: formData.bhname,
          },
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to register boarding house:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //const handleButtonClick = () => {
  // navigate('/ownerregistration'); // Navigate to the owner registration page
  //};

  return (
    <>
      <Helmet>
        <title>HypTech</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>
      <div className="w-full border border-cyan-800">
        <div className="flex min-h-screen items-center justify-center bg-[url('/public/images/bg.png')] bg-cover bg-no-repeat p-5">
          <div className="w-[647px] max-w-full rounded-lg bg-customgraybg-50 shadow-lg p-8">
            <Heading
              size="s"
              as="h1"
              className="text-white text-xl md:text-2xl text-center leading-tight md:leading-snug tracking-wide"
            >
              Register your Boarding House
            </Heading>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex flex-col">
                  <Text
                    size="md"
                    as="p"
                    className="!font-open-sans tracking-wide text-white mb-1 pb-2 pt-2"
                  >
                    Name
                  </Text>
                  <input
                    name="bhname"
                    value={formData.bhname}
                    onChange={handleChange}
                    className="w-full border-b-2 border-customColor1 text-2xl bg-transparent text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <Text
                    size="md"
                    as="p"
                    className="!font-open-sans tracking-wide text-white mb-1 pb-2 pt-2"
                  >
                    Address
                  </Text>
                  <input
                    name="bhaddress"
                    value={formData.bhaddress}
                    onChange={handleChange}
                    className="w-full border-b-2 border-customColor1 bg-transparent text-white text-2xl"
                  />
                </div>
                <div className="flex flex-col">
                  <Text
                    size="md"
                    as="p"
                    className="!font-open-sans tracking-wide text-white mb-1 pb-2 pt-2"
                  >
                    Number of Rooms
                  </Text>
                  <input
                    name="bhrooms"
                    value={formData.bhrooms}
                    onChange={handleChange}
                    className="w-full border-b-2 border-customColor1 bg-transparent text-white text-2xl"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="p-2 bg-transparent border-none cursor-pointer"
                >
                  <img
                    src="/images/NxtBtn.png"
                    alt="Next"
                    className="h-15 w-15"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
