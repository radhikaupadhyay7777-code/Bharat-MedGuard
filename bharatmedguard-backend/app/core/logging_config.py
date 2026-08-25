import logging
import sys
import json
from datetime import datetime, timezone

# Setup formatters
class StructuredJsonFormatter(logging.Formatter):
    def format(self, record):
        log_obj = {
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "func": record.funcName,
            "line": record.lineno
        }
        if hasattr(record, "security_event"):
            log_obj["security_event"] = record.security_event
        if hasattr(record, "audit_action"):
            log_obj["audit_action"] = record.audit_action
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_obj)

# Create specific loggers
def setup_logging():
    log_format = "%(asctime)s [%(levelname)s] [%(name)s]: %(message)s"
    formatter = logging.Formatter(log_format, datefmt="%Y-%m-%d %H:%M:%S")

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.handlers = [console_handler]

    # Specific category loggers
    app_logger = logging.getLogger("bmg.app")
    sec_logger = logging.getLogger("bmg.security")
    audit_logger = logging.getLogger("bmg.audit")
    ml_logger = logging.getLogger("bmg.ml")

    return app_logger, sec_logger, audit_logger, ml_logger

app_logger, security_logger, audit_logger, ml_logger = setup_logging()
