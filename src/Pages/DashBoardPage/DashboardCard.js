import { ShoppingCartOutlined } from "@ant-design/icons";
import { Card, Space, Statistic } from "antd";

function DashBoardCard({ title, value, icon}){
    return (
        <Card>
            <Space direction="horizontal">
            {icon} 
            <Statistic title={title} value = {value} />
            </Space>
        </Card>
    )
}
export default DashBoardCard
