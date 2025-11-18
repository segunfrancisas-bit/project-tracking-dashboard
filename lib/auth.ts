export function requireParams(name: string | undefined, state: string | undefined, router: any) {
  if (!name || !state) {
    router.push("/entry");
  }
}
