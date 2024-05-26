import React, {useState} from "react";
import { Input, List, Skeleton } from "antd";
import "./CustomerSearchPage.scss"
import axios from "axios";

const CustomerSearchPage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);

    const handleSearch = async value => {
      setSearchValue(value);
      setLoading(true);
  
      try {
          const response = await axios.get(`https://localhost:7262/api/Customer?customerName=${value}`);
          setCustomers(response.data);
      } catch (error) {
          console.log(`Failed to fetch customer data: ${error}`);
      } finally {
          setLoading(false);
      }
  };

return (
    <div>
      <Input.Search 
        placeholder="Search customer by phone number"
        onSearch={handleSearch}
        loading={loading}
      />

      <List
          itemLayout="horizontal"
          dataSource={customers}
          renderItem={item => (
            <List.Item>
              <Skeleton loading={loading} active avatar>
                <List.Item.Meta
                  title={item.customerName}
                  description={item.phoneNumber}
                />
              </Skeleton>
            </List.Item>
          )}
      />
    </div>
  )
}
  
  export default CustomerSearchPage;