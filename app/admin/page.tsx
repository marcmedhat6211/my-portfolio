import { FC } from "react";

const Dashboard: FC = () => {
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <h1 className="m-0">
        Welcome To {process.env.NEXT_PUBLIC_PORTFOLIO_OWNER}'s Portfolio
        Dashboard
      </h1>
    </div>
  );
};

export default Dashboard;
