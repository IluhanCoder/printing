import { FormEvent, useState } from "react";
import CreateUserForm from "./create-user-form";
import { defaultRegistrationCredentials, RegistrationCredentials } from "../auth/auth-service";
import userService from "./user-service";
import { useNavigate } from "react-router";

export default function CreateSpecialistPage () {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegistrationCredentials>(defaultRegistrationCredentials);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await userService.createSpecialist(formData);
            navigate("/");
        } catch (error) {
            setError(error.message);
        }
    }

    return <div>
        <CreateUserForm error={error} handleSubmit={handleSubmit} formData={formData} setFormData={setFormData} />
    </div>
}