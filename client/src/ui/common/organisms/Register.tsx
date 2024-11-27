import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const SIGNUP_MUTATION = gql`
  mutation Signup($data: UserDTO!) {
    signup(data: $data) {
      id
      firstName
      lastName
      email
    }
  }
`;

const UserRegister = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    role: "GUIDE", 
    gender: "MALE", 
  });

  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const {
        email,
        password,
        firstName,
        middleName,
        lastName,
        phoneNumber,
        role,
        gender,
      } = formData;

      await signup({
        variables: {
          data: {
            email,
            password,
            firstName,
            middleName,
            lastName,
            phoneNumber,
            role,
            gender,
          },
        },
      });

      if (data) {
        alert(`Signup successful! Welcome, ${data.signup.firstName}!`);
      }
    } catch (err) {
      console.error("Error signing up:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Middle Name:
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Role:
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="GUIDE">Guide</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default UserRegister;
