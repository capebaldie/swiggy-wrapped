/** Cookie names, shared by middleware (edge), route handlers, and server components.
 *  Kept import-free so the edge middleware can read them without pulling `next/headers`. */
export const SESSION_COOKIE = "sw_session";
export const SWIGGY_COOKIE = "sw_swiggy";
