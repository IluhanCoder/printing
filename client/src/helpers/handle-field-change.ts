import React, { ChangeEvent } from "react";

const handleFieldChange = <T>(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, formData: T, setFormData: React.Dispatch<React.SetStateAction<T>>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
};  

export default handleFieldChange;