import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  Image,
  Button,
  message,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import bookingData from "./bookingData.json"; // Import the JSON file


const BookingForm = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleModels, setVehicleModels] = useState({});
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelDetails, setModelDetails] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');

  const disabledDate = (current) => {
    return bookedDates.some(
      (bookedDate) =>
        current >= new Date(bookedDate.startDate) &&
        current <= new Date(bookedDate.endDate)
    );
  };

  const fetchModelDetails = (modelId) => {
    setModelDetails(
      vehicleModels[selectedVehicleType].find((model) => model.id === modelId)
    );
  };

  const updateBookingSummary = () => {
    let summary = "";
    if (firstName && lastName) {
      summary += `Customer: ${firstName} ${lastName}\n`;
    }
    if (selectedVehicleType) {
      summary += `Vehicle Type: ${
        vehicleTypes.find((type) => type.id === selectedVehicleType).name
      }\n`;
    }
    if (selectedModel) {
      summary += `Vehicle Model: ${
        vehicleModels[selectedVehicleType].find(
          (model) => model.id === selectedModel
        ).name
      }\n`;
    }
    if (startDate && endDate) {
      summary += `Dates: ${startDate.format("YYYY-MM-DD")} to ${endDate.format(
        "YYYY-MM-DD"
      )}\n`;
    }
    return summary;
  };

  const handleSubmit = async () => {
    if (
      !firstName ||
      !lastName ||
      !selectedVehicleType ||
      !selectedModel ||
      !startDate ||
      !endDate
    ) {
      message.error("Please fill in all required details before booking.");
      return;
    }

    // Placeholder function for actual booking submission (replace with API call)
    console.log("Booking data:", {
      firstName,
      lastName,
      vehicleType: selectedVehicleType,
      vehicleModel: selectedModel,
      startDate,
      endDate,
    });

    message.success("You have been booked successfully!");

    // Your actual booking submission logic using an API call would go here
    // (e.g., sending booking data to your backend)
  };

  useEffect(() => {
    setVehicleTypes(bookingData.vehicleTypes);
    setVehicleModels(bookingData.vehicleModels);
    setBookedDates(bookingData.bookedDates);
  }, []); // Empty dependency array to run only once on component mount

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item label="First Name" hasFeedback required>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
        />
      </Form.Item>

      <Form.Item label="Last Name" hasFeedback required>
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
        />
      </Form.Item>

      <Form.Item label="Vehicle Type">
        <Radio.Group
          value={selectedVehicleType}
          onChange={(e) => setSelectedVehicleType(e.target.value)}
        >
          {vehicleTypes.map((type) => (
            <Radio.Button key={type.id} value={type.id}>
              {type.name}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>

      {selectedVehicleType && ( // Render specific models only if a vehicle type is selected
        <Form.Item label="Specific Model">
          <Radio.Group
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {vehicleModels[selectedVehicleType]?.map((model) => (
              <Radio.Button
                key={model.id}
                value={model.id}
                onClick={() => fetchModelDetails(model.id)}
              >
                {model.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
      )}

      {modelDetails && ( // Render model details only if a model is selected
        <div>
          <h2>{modelDetails.name}</h2>
          <p>{modelDetails.description}</p>
          {modelDetails.image && <Image width={200} src={modelDetails.image} />}
        </div>
      )}

      {selectedModel && ( // Render date picker only if a model is selected
        <Form.Item label="Date Range Picker">
          <DatePicker.RangePicker
            disabledDate={disabledDate}
            ranges={["Today", "Tomorrow", "This Week", "Next Week"]}
            onChange={(dates) => {
              setStartDate(dates[0]);
              setEndDate(dates[1]);
            }}
          />
        </Form.Item>
      )}

      <Form.Item label="Booking Summary">
        <pre>{updateBookingSummary()}</pre>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!updateBookingSummary()}
        >
          Submit Booking
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BookingForm;