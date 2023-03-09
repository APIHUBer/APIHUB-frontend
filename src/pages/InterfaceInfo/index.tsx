import {
  getInterfaceInfoByIdUsingGET,
  invokeInterfaceInfoUsingPOST,
} from '@/services/apihub-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Card, Col, Descriptions, Divider, Form, message, Row, theme } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

/**
 * home page
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);

  const params = useParams();

  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');

  const loadData = async () => {
    if (!params.id) {
      message.error('Parameter does not exist');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGET({ id: Number(params.id) });
      setData(res.data);
    } catch (error: any) {
      message.error('Load data failed. ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('Interface does not exist');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPOST({
        id: params.id,
        ...values,
      });
      setInvokeRes(res.data);
      message.success('Invoke successfully');
    } catch (error: any) {
      message.error('Invoke failed!' + error.message);
    }
    setInvokeLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <PageContainer title="Interface Documentation">
      <Card>
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="Status">{data.status ? 'Open' : 'Close'}</Descriptions.Item>
            <Descriptions.Item label="Description">{data.description}</Descriptions.Item>
            <Descriptions.Item label="Request URL">{data.url}</Descriptions.Item>
            <Descriptions.Item label="Request Method">{data.method}</Descriptions.Item>
            <Descriptions.Item label="Request Parameters">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="Request Header">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="Response Header">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="CreateTime">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="CreateTime">{data.updateTime}</Descriptions.Item>
          </Descriptions>
        ) : (
          <h2>Interface does not exist</h2>
        )}
      </Card>
      <Divider />
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Live Testing">
            <Form
              name="invoke"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item label="Request Parameters" name="userRequestParams">
                <TextArea />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Invoke
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Testing Result" loading={invokeLoading} style={{ height: '100%' }}>
            {invokeRes}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Index;
