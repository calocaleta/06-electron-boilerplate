export const executeCommand = async (command, path) => {
    try {
        const result = await window.ipcRenderer.exec(command, path);
        console.log(result.stdout);
        return result;
    } catch (error) {
        console.error(error.error);
        throw error;
    }
};

export const executeCommands = async (commands, path) => {
    for (const command of commands) {
        try {
            await executeCommand(command, path);
        } catch (error) {
            console.error(error.error);
        }
    }
};