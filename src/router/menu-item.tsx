import { HomeOutlined, CoffeeOutlined } from '@ant-design/icons'

interface MenuItem {
    key: string
    label: string
    icon?: Element
    children?: MenuItem[] | undefined
    minRole?: number // Add the minRole property
}

type Role = number

export const MENU_ITEMS: ({ minRole: number; children: any[]; icon: JSX.Element; label: string; key: string } | {
    minRole: number;
    children: MenuItem[] | undefined;
    icon: JSX.Element;
    label: string;
    key: string
})[] = [
    {
        key: '/',
        label: '打标签配置',
        icon: <HomeOutlined />,
        children: undefined,
        minRole: 1,
    },
    {
        key: '/tagging',
        label: '打标签',
        icon: <CoffeeOutlined />,
        children: undefined,
        minRole: 1,
    },
    {
        key: '/agent-hub',
        label: '大模型agent',
        icon: <CoffeeOutlined />,
        children: undefined,
        minRole: 1,
    }
]

export const filterMenuItemsByRole = (menuItems: MenuItem[], roles: Role[]): MenuItem[] => {
    return menuItems.reduce<MenuItem[]>((filteredItems, item) => {
        const { minRole = 0, children, ...rest } = item

        // Check if the user has any role that meets or exceeds the minRole requirement
        if (roles.some((role) => role >= minRole)) {
            // If the item has children, recursively filter them as well
            const filteredChildren = children ? filterMenuItemsByRole(children, roles) : undefined
            filteredItems.push({ ...rest, minRole, children: filteredChildren })
        }

        return filteredItems
    }, [])
}
