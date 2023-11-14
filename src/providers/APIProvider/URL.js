const URL = {
    baseURL: "https://aaiss.ir/",
    services: {
        default: "api/",
        2021: "api/2021/",
        2023: "api/2023/",
        2024: "api/2024/",
    },
    endpoints: {
        staff: "staff/",
        workshop: "workshop/",
        misc: "misc/",
        // misc: {
        //     register: "misc/register/",
        //     scheduled: "misc/scheduled/",
        //     about: "misc/about/",
        // },
        user: {
            default: "user/",
            activate: "activate/"
        },
        token: {
            default: "token/",
            refresh: "token/refresh/",
        },
        payment: {
            default: "payment/",
            verify: "payment/verify/"
        },
        committee: "committee/",
        presenter: "presenter/",
        teacher: "teacher/",
        presentation: "presentation/"
    }
}

export default URL