import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetFooter } from "@/components/ui/sheet";
import { getOrdinalSuffix } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubscription,
  type CreateSubscriptionResponse,
} from "@/api/create-subscription";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/query-keys";
import type { GetAllSubscriptionsResponse } from "@/api/get-all-subscriptions";

const createSubscriptionSchema = z.object({
  name: z.string().min(1, {
    message: "Service name is required.",
  }),
  totalPrice: z.coerce
    .number({ message: "Total price is required." })
    .positive({
      message: "Price must be a positive number.",
    }),
  dueDay: z.coerce
    .number({ message: "Due day is required." })
    .int()
    .min(1)
    .max(31),
});

type CreateSubscriptionFormValues = z.infer<typeof createSubscriptionSchema>;

interface CreateSubscriptionSheetFormProps {
  onClose: () => void;
}

export function CreateSubscriptionSheetForm({
  onClose,
}: CreateSubscriptionSheetFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateSubscriptionFormValues>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      name: "",
      totalPrice: undefined,
      dueDay: undefined,
    },
  });

  function insertNewSubscriptionOnCache(
    newSubscription: CreateSubscriptionResponse
  ) {
    queryClient.setQueryData<GetAllSubscriptionsResponse[]>(
      queryKeys.subscriptions.all(),
      (oldSubscriptions) => {
        if (!oldSubscriptions) return [newSubscription];
        return [newSubscription, ...oldSubscriptions];
      }
    );
  }

  const { mutateAsync: createSubscriptionMutation } = useMutation({
    mutationFn: createSubscription,
  });

  async function onSubmit(values: CreateSubscriptionFormValues) {
    const { name, totalPrice, dueDay } = values;

    await createSubscriptionMutation(
      {
        name,
        total_price: totalPrice,
        due_day: dueDay,
      },
      {
        onSuccess: (res) => {
          insertNewSubscriptionOnCache(res);
          onClose();
          toast.success("Subscription created successfully!");
        },
      }
    );
  }

  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-4"
          id="create-subscription-form"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="Subscription name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of your subscription.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="19.99"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Day</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select due day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    position="popper"
                    className="w-full min-w-[8rem] max-h-72 overflow-y-auto"
                  >
                    {dayOptions.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                        {getOrdinalSuffix(day)} of the month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  This is the day of the month you will be billed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <SheetFooter className="flex flex-col">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="mb-2"
        >
          Cancel
        </Button>
        <Button type="submit" form="create-subscription-form">
          Save changes
        </Button>
      </SheetFooter>
    </>
  );
}
