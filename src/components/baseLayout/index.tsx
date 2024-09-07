import {Breadcrumb, ConfigProvider, Divider, Layout, Menu, theme} from 'antd'
const { Header, Footer, Sider, Content } = Layout;
import { Outlet, To, useLocation, useNavigate } from 'react-router-dom'
import {useState} from "react";

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#222',
    // backgroundColor: '#4096ff',
};


const BaseLayout = () => {
    const [collapsed, setCollapsed] = useState(false)
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()
    return (
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        // 这个token会影响关闭按钮的位置。
                        headerHeight: 0,
                        triggerHeight: 36,
                        zeroTriggerHeight: 36,
                        zeroTriggerWidth: 36,
                    },
                },
                token: {
                    // Seed Token，影响范围大
                    // colorPrimary: '#00b96b',
                    // borderRadius: 2,
                    // 派生变量，影响范围小
                    colorBgContainer: '#f6ffed',
                },
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    breakpoint={'xs'}
                    collapsible
                    collapsed={collapsed}
                    collapsedWidth="0"
                    onBreakpoint={(broken) => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                        setCollapsed(collapsed)
                    }}
                >
                    <div className="demo-logo-vertical" />
                    <div className="flex h-auto items-center justify-center p-2 text-xl">
                        {!collapsed ? 'Nahida System' : ''}
                    </div>
                </Sider>
                <Layout className="bg-white">
                    {/*<Header style={headerStyle}>Header</Header>*/}
                    <Content className="m-4">
                        <div
                            className="p-6"
                        >
                            <Outlet />
                        </div>
                    </Content>
                    <Footer style={footerStyle}>
                        Nahida System for LLM ©{new Date().getFullYear()} Created by Tokei.
                        <span>
                            {BUILD_DATE}
                        </span>
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>

    )
}

export default BaseLayout
