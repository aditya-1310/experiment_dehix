import { pino } from "pino";
import { Service } from "fastify-decorators";
import { join } from "path";
import { fileURLToPath } from "url";

// ANSI escape codes for coloring
const colors = {
  service: "\x1b[34m", // Blue
  controller: "\x1b[35m", // Magenta
  constant: "\x1b[36m", // Cyan
  dao: "\x1b[33m", // Yellow
  unknown: "\x1b[37m", // White
  reset: "\x1b[0m", // Reset color
};

// Helper to extract the calling file, function name, and categorize file type
function getCallerInfo() {
  const originalFunc = Error.prepareStackTrace;
  let callerfile = "";
  let functionName = "";

  try {
    const err = new Error();

    // Define the custom stack trace formatter
    Error.prepareStackTrace = (err, stack) => stack;

    const stack = err.stack as unknown as NodeJS.CallSite[];
    const currentfile = stack[0]?.getFileName();

    for (const callSite of stack.slice(1)) {
      callerfile = callSite.getFileName() || "";
      functionName = callSite.getFunctionName() || "anonymous";
      if (callerfile !== currentfile) break;
    }
  } catch (err) {
    console.error(err);
  }

  Error.prepareStackTrace = originalFunc;

  const fileName = callerfile ? fileURLToPath(callerfile) : "unknown";
  //   const stack = err.stack as unknown as NodeJS.CallSite[] | undefined;

  //   if (stack) {
  //     const currentfile = stack[0]?.getFileName();

  //     for (const callSite of stack) {
  //       callerfile = callSite?.getFileName() || "Unknown";
  //       functionName = callSite?.getFunctionName() || "anonymous";
  //       if (callerfile !== currentfile) break;
  //     }
  //   }
  // } catch (err) {
  //   console.error(err);
  // } finally {
  //   // Restore the original stack trace formatter
  //   Error.prepareStackTrace = originalFunc;
  // }

  // const fileName = callerfile ? fileURLToPath(callerfile) : "unknown";

  // Determine file type
  let fileType = "UNKNOWN";
  if (fileName.includes("service")) {
    fileType = "SERVICE";
  } else if (fileName.includes("controller")) {
    fileType = "CONTROLLER";
  } else if (fileName.includes("constant")) {
    fileType = "CONSTANT";
  } else if (fileName.includes("dao")) {
    fileType = "DAO";
  } else {
    const splitName = fileName.split("/");
    fileType = splitName[splitName.length - 1].split(".")[0].toUpperCase(); // Fallback to the filename without extension
  }

  return { fileName: join(fileName), functionName, fileType };
}

@Service()
export class Logger {
  logger: any;

  constructor() {
    this.logger = pino({
      name: "Dehix",
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard", // Format timestamp
          ignore: "pid,hostname,name",
        },
      },
      redact: ["req.headers.authorization"],
      serializers: {
        res(reply) {
          return {
            statusCode: reply.statusCode,
          };
        },
        req(request) {
          return {
            method: request.method,
            url: request.url,
            path: request.routerPath,
            parameters: request.params,
            headers: request.headers,
          };
        },
      },
    });
  }

  // Helper to get the color for a specific file type
  getColorForFileType(fileType: string) {
    switch (fileType) {
      case "SERVICE":
        return colors.service;
      case "CONTROLLER":
        return colors.controller;
      case "CONSTANT":
        return colors.constant;
      case "DAO":
        return colors.dao;
      default:
        return colors.unknown;
    }
  }

  // Utility to format data (objects and arrays)
  formatMessage(message: any) {
    if (typeof message === "object") {
      try {
        return JSON.stringify(message, null, 2); // Pretty-print objects/arrays
      } catch (err) {
        return "[Unable to stringify object]";
      }
    }
    return message; // Return as-is for non-object types
  }

  // Enhanced info logger
  info(...messages: any[]) {
    const { fileName, functionName, fileType } = getCallerInfo();
    const color = this.getColorForFileType(fileType);
    const formattedMessages = messages.map(this.formatMessage).join(" ");
    this.logger.info(
      `${color}ℹ️  LOG [${fileName} -> ${fileType}: ${functionName}]\n ${formattedMessages}${colors.reset}`,
    );
  }

  // Enhanced error logger
  error(...errors: any[]) {
    const { fileName, functionName, fileType } = getCallerInfo();
    const color = this.getColorForFileType(fileType);
    const formattedErrors = errors.map(this.formatMessage).join(" ");
    this.logger.error(
      `${color}❌ ERROR [${fileName} -> ${fileType}: ${functionName}]\n ${formattedErrors}${colors.reset}`,
    );
  }

  // Enhanced warn logger
  warn(...messages: any[]) {
    const { fileName, functionName, fileType } = getCallerInfo();
    const color = this.getColorForFileType(fileType);
    const formattedMessages = messages.map(this.formatMessage).join(" ");
    this.logger.warn(
      `${color}⚠️  WARN [${fileName} -> ${fileType}: ${functionName}]\n ${formattedMessages}${colors.reset}`,
    );
  }
}

export const logger = new Logger().logger;
