import React, {useState} from "react";
import { Input, List, Skeleton } from "antd";
import "./CustomerSearchPage.scss"

const CustomerSearchPage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);

    const handleSearch = value => {
        setLoading(true);

        setTimeout(() => {
            setCustomers(fakeAPICall(value));
            setLoading(false);
    }, 2000);
    
};

/*const handleSearch = async value => {
    setLoading(true);
    try {
      // Call backend API
      const response = await axios.get(`/api/customers?phoneNumber=${value}`);
      // Set customer data API call
      setCustomers(response.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
*/
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
                title={item.name}
                description={item.phoneNumber}
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  )
}

const fakeAPICall = (phoneNumber) => {
    return [
      {
        name: phoneNumber === '1234567890' ? 'John Doe' : 'Anonymous',
        phoneNumber: phoneNumber,
      }
    ]
  };
  
  export default CustomerSearchPage;