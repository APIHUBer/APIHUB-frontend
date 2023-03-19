import { listInterfaceInfoByPageUsingGET } from '@/services/apihub-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { List, message, Skeleton, theme } from 'antd';
import React, { useEffect, useState } from 'react';

/**
 * home page
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);
  const pagesize = 10;

  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');

  const loadData = async (current = 1, pageSize = pagesize) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPageUsingGET({});
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error) {
      message.error('Load data failed. ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title="Online API Open Platform">
      <List
        className="my-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const apilink = `/interface_info/${item.id}`;
          return (
            <List.Item
              actions={[
                <a key={item.id} href={apilink}>
                  View
                </a>,
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={<a href={apilink}>{item.name}</a>}
                  description={item.description}
                />
              </Skeleton>
            </List.Item>
          );
        }}
        pagination={{
          showTotal(total: number) {
            return 'Total: ' + total;
          },
          pageSize: pagesize,
          total,
          onChange(page, pageSize) {
            loadData(page, pageSize);
          },
        }}
      />
    </PageContainer>
  );
};

export default Index;
