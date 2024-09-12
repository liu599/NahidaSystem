import { createBrowserRouter } from 'react-router-dom'
import BaseLayout from "@/components/baseLayout";

export const router = ({ routePrefix }: { routePrefix?: string }) => createBrowserRouter(
    [
        {
            path: '/',
            element: <BaseLayout />,
            children: [
                {
                    index: true,
                    path: '',
                    async lazy() {
                        return {
                            Component: (await import('@/pages/GithubSentinel')).default,
                        }
                    },
                },
                {
                    index: true,
                    path: '/',
                    async lazy() {
                        return {
                            Component: (await import('@/pages/GithubSentinel')).default,
                        }
                    },
                },
                {
                    index: true,
                    path: 'tagging',
                    async lazy() {
                        return {
                            Component: (await import('@/pages/Tagging')).default,
                        }
                    },
                }
            ]
        }
    ],
    { basename: routePrefix || '/' }
)
