import { Data } from "../data/data-types";
import { IUser } from "../user/user-types";

export interface IServiceImage {
    data: Buffer;
    contentType: string;
  }
  
  export interface Service  {
    name: string,
    desc: string,
    material: Data,
    technology: Data,
    user: IUser,
    images: IServiceImage[]
  }
  
  export interface ServiceCredentials {
    name: string;
    desc: string;
    material: string | undefined;
    technology: string | undefined;
    images: File[];
  }
  
  export const DefaultServiceCredentials: ServiceCredentials = {
    name: "",
    desc: "",
    material: "",
    technology: "",
    images: []  // start with an empty array
  };
  
  