from fastapi import FastAPI, HTTPException
import psutil
import subprocess

app = FastAPI(title="Process Manager API")

@app.get("/processes")
def list_processes():
    """Lista todos os processos em execução"""
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'username', 'status']):
        try:
            processes.append(proc.info)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return {"total": len(processes), "processes": processes}

@app.get("/processes/{pid}")
def inspect_process(pid: int):
    """Inspeciona um processo específico pelo PID"""
    try:
        proc = psutil.Process(pid)
        return {
            "pid": proc.pid,
            "name": proc.name(),
            "status": proc.status(),
            "cpu_percent": proc.cpu_percent(),
            "memory_percent": proc.memory_percent(),
            "cmdline": proc.cmdline(),
            "username": proc.username()
        }
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Processo {pid} não encontrado")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail="Acesso negado ao processo")

@app.post("/processes/start")
def start_process(command: str):
    """Inicia um novo processo"""
    try:
        proc = subprocess.Popen(command.split())
        return {"pid": proc.pid, "status": "iniciado", "command": command}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/processes/{pid}")
def terminate_process(pid: int, force: bool = False):
    """Encerra um processo pelo PID"""
    try:
        proc = psutil.Process(pid)
        if force:
            proc.kill()
        else:
            proc.terminate()
        return {"pid": pid, "status": "encerrado", "force": force}
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Processo {pid} não encontrado")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail="Acesso negado")
