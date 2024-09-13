import {
    Button,
    Space,
    Row,
    Col,
    Typography,
    Divider,
    RadioChangeEvent,
    Radio,
    Form,
    InputNumberProps,
    Slider, InputNumber, Select
} from "antd";
import React, {useState} from "react";
const { Title, Paragraph, Text, Link } = Typography;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 14 },
};

const GithubSentinelPage =  () => {
    const [form] = Form.useForm();
    const [value, setValue] = useState(1);
    const [inputValue, setInputValue] = useState(1);

    const slideOnChange: InputNumberProps['onChange'] = (newValue) => {
        setInputValue(newValue as number);
    };

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const onFinish = (values: any) => {
        console.log(values);
    };

    const onReset = () => {
        form.resetFields();
    };

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    return (
        <>
            <Row>
                <Col span={10} style={{marginRight: "60px"}}>
                    <Title level={2} style={{marginBottom: "32px"}}>订阅配置</Title>

                    <Space>
                        <Form
                            {...layout}
                            form={form}
                            onFinish={onFinish}
                            labelAlign={"left"}
                            style={{ width: '640px' }}
                        >
                            <Form.Item label="基础大模型">
                                <Radio.Group onChange={onChange} value={value}>
                                    <Radio.Button value={1}>GPT4</Radio.Button>
                                    <Radio.Button value={2}>本地模型</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="已订阅源">
                                <Select
                                    defaultValue="lucy"
                                    style={{ width: 120 }}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'jack', label: 'Jack' },
                                        { value: 'lucy', label: 'Lucy' },
                                        { value: 'Yiminghe', label: 'yiminghe' },
                                        { value: 'disabled', label: 'Disabled', disabled: true },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item label="报告周期">
                                <Row>
                                    <Col span={12}>
                                        <Slider
                                            min={1}
                                            max={7}
                                            onChange={slideOnChange}
                                            value={typeof inputValue === 'number' ? inputValue : 0}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <InputNumber
                                            min={1}
                                            max={7}
                                            style={{ margin: '0 8px' }}
                                            value={inputValue}
                                            onChange={slideOnChange}
                                        /> 天
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                    <Button htmlType="button" onClick={onReset}>
                                        Reset
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>


                    </Space>
                </Col>
                <Col span={10} style={{borderLeft: "4px solid red", padding: "24px"}}>
                    <Title level={2}>Ollma项目进展</Title>
                    <Space>
                        <Text type="secondary">时间周期: 2024-08-14至2024-08-21 ·</Text>
                        <Text type="secondary">制作人: My_Agent_1.0 ·</Text>
                        <Link href="https://ant.design" target="_blank">
                            下载该文件
                        </Link>
                    </Space>
                    <Divider dashed />
                    <Title level={3}>新增功能</Title>
                    <Paragraph>
                        <ul>
                            <li>
                                <span>新增了问题1</span>
                            </li>
                            <li>
                                <span>新增了问题2</span>
                            </li>
                            <li>
                                <span>新增了问题3</span>
                            </li>
                        </ul>
                    </Paragraph>
                    <Title level={3}>主要改进</Title>
                    <Paragraph>
                        <ul>
                            <li>
                                <span>改进了问题1</span>
                            </li>
                            <li>
                                <span>改进了问题2</span>
                            </li>
                            <li>
                                <span>改进了问题3</span>
                            </li>
                        </ul>
                    </Paragraph>
                    <Title level={3}>修复问题</Title>
                    <Paragraph>
                        <ul>
                            <li>
                                <span>解决了问题1</span>
                            </li>
                            <li>
                                <span>解决了问题2</span>
                            </li>
                            <li>
                                <span>解决了问题3</span>
                            </li>
                        </ul>
                    </Paragraph>

                </Col>
            </Row>
        </>

    )
}

export default () => {
    return (
        <GithubSentinelPage/>
    )
}
