import {Breadcrumb, ConfigProvider, Divider, Layout, Menu, theme} from 'antd'
const { Header, Footer, Sider, Content } = Layout;
import { Outlet, To, useLocation, useNavigate } from 'react-router-dom'
import { MENU_ITEMS } from "@/router/menu-item.tsx";
import React, {useState} from "react";
import { history } from 'umi';

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#222',
    // backgroundColor: '#4096ff',
};


const BaseLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()
    const handleMenuClick = (event: { key: To }) => {
        // console.log('点击菜单', event.key)
        // console.log(window.location)
        const params = new URLSearchParams(window.location.search)
        // console.log(params.get('id'))
        navigate(event.key, {})
    }
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
                    // colorBgContainer: '#f6ffed',
                    fontSize: 14,
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
                    style={{
                        color: '#f2f2f2'
                    }}
                >
                    <div className="demo-logo-vertical" />
                    <div className="flex h-auto items-center justify-center p-2 text-xl">
                        {!collapsed ? 'Tagging' : ''}
                    </div>
                    <Menu
                        theme="dark"
                        defaultOpenKeys={[location.pathname.split('/')[1]]}
                        defaultSelectedKeys={['/']}
                        selectedKeys={[location.pathname]}
                        mode="inline"
                        items={MENU_ITEMS}
                        onClick={handleMenuClick}
                    />
                </Sider>
                <Layout className="bg-white">
                    {/*<Header style={headerStyle}>Header</Header>*/}
                    <Content className="m-4">
                        <div
                            className="p-6"
                            style={{padding: '24px'}}
                        >
                            <Outlet />
                        </div>
                    </Content>

                    <Footer style={footerStyle}>
                        Nahida System for LLM ©{new Date().getFullYear()} Created by Tokei.
                        <span>
                            {BUILD_DATE}.{BUILD_ENV}.{APP_VERSION}
                        </span>
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>

    )
}

export default BaseLayout
