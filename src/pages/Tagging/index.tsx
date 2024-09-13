import {Button, Col, Divider, Form, Row, Select, Space, Typography} from 'antd';
import {useEffect} from "react";
import {getTaggingSetting} from "@/pages/TaggingSetting/api.ts";
const { Title, Paragraph, Text, Link } = Typography;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const data = [
    {
        label: "标签组1",
        type: "multiple",
        options: [
            {
                value: "标签1",
                label: <span>标签1</span>
            },
            {
                value: "标签2",
                label: <span>标签2</span>
            }
        ]
    },
    {
        label: "标签组2",
        type: "multiple",
        options: [
            {
                value: "标签3",
                label: <span>标签3</span>
            },
            {
                value: "标签4",
                label: <span>标签4</span>
            }
        ]
    },
    {
        label: "标签组3",
        type: "single",
        options: [
            {
                value: "标签5",
                label: <span>标签5</span>
            },
            {
                value: "标签6",
                label: <span>标签6</span>
            }
        ]
    }
]

const Tagging =  () => {
    const [form] = Form.useForm();
    const chunkSize = 2; // 每行两个元素
    const chunks = [];

    const onReset = () => {
        form.resetFields();
    };

    const onFill = () => {
        form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
    };



    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        chunks.push(
            <Row key={`row-${i}`}>
                {chunk.map((item, index) => (
                    <Col span={12} key={`item-${index}`}>
                        <Form.Item
                            name={`item-${index}-${i}`}
                            label={item.label}
                            rules={[{ required: true, message: '数据校验失败, 请打标签', type: item.type === 'single' ? 'string' : 'array' }]}
                        >
                            <Select
                                mode={item.type === 'single' ? undefined : 'tags'}
                                options={item.options}
                                placeholder="请选择标签"
                            />
                        </Form.Item>
                    </Col>
                ))}
            </Row>
        );
    }

    return (
        <div style={{maxWidth: "1280px", margin: "0 auto"}}>
            <Divider orientation="left" orientationMargin="0" style={{  borderColor: '#7cb305' }}>
                待标注内容
            </Divider>
            <Row style={{marginBottom: "32px", minHeight: "300px", padding: "24px"}}>
                <Col span={24}>
                    <Typography>
                        <Text type="secondary">第 1 / 300 个问题</Text>
                        <Title level={3}>问题</Title>
                        <Paragraph>
                            In the process of internal desktop applications development, many different design specs and
                            implementations would be involved, which might cause designers and developers difficulties and
                            duplication and reduce the efficiency of development.
                        </Paragraph>
                        <Title level={3}>期望回答</Title>
                        <Paragraph>
                            After massive project practice and summaries, Ant Design, a design language for background
                            applications, is refined by Ant UED Team, which aims to{' '}
                            <Text strong>
                                uniform the user interface specs for internal background projects, lower the unnecessary
                                cost of design differences and implementation and liberate the resources of design and
                                front-end development
                            </Text>
                            .
                        </Paragraph>
                    </Typography>
                </Col>
            </Row>
            <Divider orientation="left" orientationMargin="0" style={{  borderColor: '#7cb305', marginBottom: "32px" }}>
                标注选项
            </Divider>
            <Form
                name="validate_other"
                {...formItemLayout}
                form={form}
                style={{ maxWidth: '100%', width: '100%', marginBottom: '60px' }}
            >
                {
                    chunks
                }
            </Form>
            <Divider orientation="left" orientationMargin="0" style={{  borderColor: '#7cb305' }}>
                操作区
            </Divider>
            <Row style={{textAlign: "center"}}>
                <Col span={24}>
                    <Space size="large">
                        <Button htmlType="button" onClick={onReset} danger size="large">
                            重置
                        </Button>
                        <Button type="primary" htmlType="submit" size="large">
                            上一条数据
                        </Button>
                        <Button type="primary" htmlType="submit" size="large">
                            下一条数据
                        </Button>
                        <Button type="link" htmlType="button" onClick={onFill} size="large">
                            (智能填充)
                        </Button>
                    </Space>
                </Col>
            </Row>


        </div>
    )
}

export default () => {
    return (
        <Tagging/>
    )
}
