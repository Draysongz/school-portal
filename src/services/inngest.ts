import { Inngest } from "inngest";
import { UserService } from "@/services/users/user.service";
import prisma from "@/lib/prisma";

export const inngest = new Inngest({ id: "school-portal" });

export const processBulkUpload = inngest.createFunction(
  { id: "process-bulk-upload" },
  { event: "app/bulk.upload" },
  async ({ event, step }) => {
    const { rows, role, schoolId, uploadLogId } = event.data;

    const results = await step.run("process-rows", async () => {
      const success: any[] = [];
      const errors: any[] = [];

      for (const row of rows) {
        try {
          await UserService.createUserInSchool({
            email: row.email,
            firstName: row.firstName,
            lastName: row.lastName,
            role,
            schoolId,
          });
          success.push(row.email);
        } catch (error: any) {
          errors.push({ email: row.email, error: error.message });
        }
      }

      return { success, errors };
    });

    await step.run("update-log", async () => {
      await prisma.cSVUploadLog.update({
        where: { id: uploadLogId },
        data: {
          status: results.errors.length === 0 ? "SUCCESS" : "PARTIAL_SUCCESS",
          errorLog: JSON.stringify(results.errors),
        },
      });
    });

    return { results };
  }
);
