import React from 'react';
import '../DashBoardPage/DashBoardPage.scss';
import {Row, Col, Card, Table} from 'antd';

const DashBoardPage = () => {
    const data = [
        {
          key: '1',
          name: 'John',
          sales: 32,
          revenue: '$1000',
        },
        {
          key: '2',
          name: 'Joe',
          sales: 42,
          revenue: '$1500',
        }
      ];
    
      const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Sales',
          dataIndex: 'sales',
          key: 'sales',
        },
        {
          title: 'Revenue',
          dataIndex: 'revenue',
          key: 'revenue',
        },
      ];

    //   useEffect(() => {
    //     axios.get('https://api.example.com/top-sellers')
    //       .then((response) => {
    //            const topSellers = response.data.slice(0,3); // Get the first 3 records
    //            setData(topSellers);
    //       })
    //       .catch((error) => {
    //            console.error(`Error: ${error}`);
    //       });
    //   }, []);
    return (
        <div className='dashboard-content'>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <div className="overview">
                        <Card title="Sales Overview">Content</Card>
                        <Card title="Purchase Overview">Content</Card>
                        <Card title="Monthly Earnings Chart">Content</Card>
                        <Table title={() => <b>Top Sellers</b>} dataSource={data} 
                                                            columns={columns} 
                                                            pagination={false}
                                                        />
                    </div>
                </Col>
                <Col className="gutter-row" span={12}>
                    <div className="overView">
                        <Card title="Inventory Summary">Content</Card>
                        <Card title="Product Summary">Content</Card>
                        <Card title="Top Selling Stocks">Content</Card>
                        <Card title="Low Quantity Stocks">Content</Card>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default DashBoardPage