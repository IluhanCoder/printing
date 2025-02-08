import { useParams } from "react-router-dom";
import ServiceDetailsPage from "./service-details-page";
function ServiceDetailsWrapper() {
  const { id } = useParams<{ id: string }>();
  return id ? <ServiceDetailsPage serviceId={id} /> : <div>No service id provided</div>;
}

export default ServiceDetailsWrapper;