import { ShoppingCartOutlined } from "@ant-design/icons";
import '../DashBoardPage/DashboardCard.scss'
import { Card, Space, Statistic } from "antd";

function DashBoardCard({ title, value, icon}){
    return (
        <Card className="dashboard-card" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px", padding: "1rem" }}>
            <Space direction="horizontal">
                    {icon} 
            <Statistic           
                title={<span className="dashboard-title">{title}</span>} 
                value={value} />
            </Space>
        </Card>
    )
}
export default DashBoardCard
