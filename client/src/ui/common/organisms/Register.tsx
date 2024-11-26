import { useState } from "react";
import {  gql } from "@apollo/client";
const UserRegister = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    passPhoto: null,
    citizenshipFront: null,
    citizenshipBack: null,
    license: null,
    type: "PROFILE",
  });

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event: any) => {
    const { name, files: selectedFiles } = event.target;
    if (selectedFiles.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedFiles[0],
      }));
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSend.append(key, value);
      }
    });

    try {
      /*  */
      const response = gql`
        mutation {
          signup(
            data: {
              email: "test@example.com"
              password: "Aayush123#"
              firstName: "Test User"
              middleName: "Aayy"
              lastName: "xys"
              phoneNumber: "sadddad"
              role: "GUIDE"
              gender: "MALE"
            }
          ) {
            id
            email
            firstName
            password
            phoneNumber
            lastName
            middleName
            phoneNumber
            gender
          }
        }
      `;
      console.log("🚀 ~ handleSubmit ~ response:", response)
      alert("Signup successful!");
    } catch (error) {
      console.error("Error uploading files:", error);
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
     
      <input type="hidden" name="type" value={formData.type} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UserRegister;

// import { useState } from "react";
// import { gql } from "@apollo/client";

// const UserRegister = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     phoneNumber: "",
//     gender: "MALE", // Default value
//     role: "USER", // Default value
//   });


//   const handleChange = (e: { target: { name: any; value: any } }) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: { preventDefault: () => void }) => {
//     e.preventDefault();
//     try {
//       const response = gql`
//         mutation {
//           signup(
//             data: {
//               email: "test@example.com"
//               password: "Aayush123#"
//               firstName: "Test User"
//               middleName: "Aayy"
//               lastName: "xys"
//               phoneNumber: "sadddad"
//               role: "GUIDE"
//               gender: "MALE"
//             }
//           ) {
//             id
//             email
//             firstName
//             password
//             phoneNumber
//             lastName
//             middleName
//             phoneNumber
//             gender
//           }
//         }
//       `;
//       alert("Signup successful!");
//       console.log(response, "ahhgdhsd");
//     } catch (err) {
//       console.error(err);
//       alert("Error signing up");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Email:</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>Password:</label>
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>First Name:</label>
//         <input
//           type="text"
//           name="firstName"
//           value={formData.firstName}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>Middle Name:</label>
//         <input
//           type="text"
//           name="middleName"
//           value={formData.middleName}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>Last Name:</label>
//         <input
//           type="text"
//           name="lastName"
//           value={formData.lastName}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>Phone Number:</label>
//         <input
//           type="text"
//           name="phoneNumber"
//           value={formData.phoneNumber}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <label>Gender:</label>
//         <select name="gender" value={formData.gender} onChange={handleChange}>
//           <option value="MALE">Male</option>
//           <option value="FEMALE">Female</option>
//           <option value="OTHER">Other</option>
//         </select>
//       </div>
//       <div>
//         <label>Role:</label>
//         <select name="role" value={formData.role} onChange={handleChange}>
//           <option value="USER">User</option>
//           <option value="ADMIN">Admin</option>
//         </select>
//       </div>
//       <button type="submit">
//       </button>
//     </form>
//   );
// };

// export default UserRegister;
