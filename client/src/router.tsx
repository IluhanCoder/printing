import { Route, Routes } from "react-router";
import LoginPage from "./auth/login-page";
import RegistrationPage from "./auth/registration-page";
import CreateSpecialistPage from "./user/create-specialist-page";
import NewDataPage from "./data/new-data-page";
import TechnologiesPage from "./data/technologies-page";
import NewServicePage from "./service/new-service-page";
import ServiceDetailsWrapper from "./service/service-details-wrapper";
import ServicesListPage from "./service/services-list-page";
import OrderPage from "./order/order-page";
import OrderDetailsPage from "./order/order-details-page";
import OrderListPage from "./order/order-list-page";
import NewBlogPage from "./blog/create-blog-page";
import BlogPage from "./blog/blog-page";
import BlogList from "./blog/blog-list-page";
import ChatPage from "./chat/chat-page";
import ChatPageWrapper from "./chat/chat-page-wrapper";
import ChatsListPage from "./chat/chats-list-page";

export default function Router() {
    return <Routes>
        <Route path="/registration" element={<RegistrationPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/create-specialist" element={<CreateSpecialistPage/>}/>
        <Route path="/create-data" element={<NewDataPage/>}/>
        <Route path="/technologies" element={<TechnologiesPage/>}/>
        <Route path="/create-service" element={<NewServicePage/>}/>
        <Route path="/service/:id" element={<ServiceDetailsWrapper/>} />
        <Route path="/services-list" element={<ServicesListPage/>}/>
        <Route path="/order/:serviceId" element={<OrderPage/>}/>
        <Route path="/order-details/:orderId" element={<OrderDetailsPage/>}/>
        <Route path="/order-list" element={<OrderListPage/>}/>
        <Route path="/create-blog" element={<NewBlogPage/>}/>
        <Route path="/blog/:id" element={<BlogPage/>}/>
        <Route path="/blog-list" element={<BlogList/>}/>
        <Route path="/chat/:currentUser/:otherUser/:serviceId" element={<ChatPageWrapper/>} />
        <Route path="/chats-list" element={<ChatsListPage/>}/>
    </Routes>
}