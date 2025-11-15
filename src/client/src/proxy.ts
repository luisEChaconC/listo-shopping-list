import { roleProxy } from "./services/proxy";

export const proxy = roleProxy;
export const config = {
	matcher: ["/admin", "/products", "/shopping-lists"],
};
