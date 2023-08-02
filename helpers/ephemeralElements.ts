
export default async function pickFiles(params?: {multiple?: false, accept?: string}): Promise<File|null>
export default async function pickFiles(params: {multiple: true, accept?: string}): Promise<File[]>


export default async function pickFiles(params: {multiple?: boolean, accept?: string} = {}): Promise<File|null|File[]> {
    const picker = document.createElement("input");
    picker.type = "file";
    const multiple = params.multiple ?? false;
    picker.multiple = multiple;
    picker.accept = params.accept ?? '*';
    picker.click();

    const fileArray = await new Promise<File[]>((resolve) => {

        function teardown() {
            picker.removeEventListener("change", handleInput);
            picker.removeEventListener("cancel", handleCancel);
        }

        function handleInput(e: Event) {
            if (e.currentTarget instanceof HTMLInputElement) {
                if (!e.currentTarget.files) {
                    resolve([]);
                } else {
                    resolve(Array.from(e.currentTarget.files));
                }
            } else {
                resolve([]);
            }
            teardown();
        }

        function handleCancel() {
            resolve([]);
            teardown();
        }

        picker.addEventListener("cancel", handleCancel);
        picker.addEventListener("change", handleInput);
    });

    if (multiple) {
        return fileArray;
    } else {
        return fileArray[0] || null;
    }
}
