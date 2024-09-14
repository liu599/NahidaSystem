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
                            Component: (await import('@/pages/Tagging')).default,
                        }
                    },
                },
                {
                    index: true,
                    path: '/',
                    async lazy() {
                        return {
                            Component: (await import('@/pages/Tagging')).default,
                        }
                    },
                },
                {
                    index: true,
                    path: 'agent-hub',
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
                },
                {
                    index: true,
                    path: 'taggingSetting',
                    async lazy() {
                        return {
                            Component: (await import('@/pages/TaggingSetting')).default,
                        }
                    },
                },
                {
                    index: true,
                    path: 'taggingDetail',
                    async lazy() {
                        return {
                            Component: (await import('@/pages/TaggingDetail')).default,
                        }
                    },
                }
            ]
        }
    ],
    { basename: routePrefix || '/' }
)
