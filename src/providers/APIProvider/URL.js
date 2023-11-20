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
        user: {
            default: "user/",
            activate: "activate/",
            presentation: "user/presentation/",
            workshop: "user/workshop/"
        },
        token: {
            default: "token/", //TODO
            refresh: "token/refresh/", //TODO
        },
        payment: {
            default: "payment/",
            verify: "payment/verify/",
        },
        committee: "committee/",
        presenter: "presenter/",//here
        teacher: "teacher/", //YES
        presentation: "presentation/", //YES
    }
}

export default URL