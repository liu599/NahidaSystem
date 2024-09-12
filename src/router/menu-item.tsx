import { HomeOutlined, CoffeeOutlined } from '@ant-design/icons'

interface MenuItem {
    key: string
    label: string
    icon?: Element
    children?: MenuItem[]
    minRole?: number // Add the minRole property
}

type Role = number

export const MENU_ITEMS: MenuItem[] = [
    {
        key: '/',
        label: 'HOME',
        icon: <HomeOutlined />,
        minRole: 1,
    },
    {
        key: '/tagging',
        label: '打标签',
        icon: <CoffeeOutlined />,
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
