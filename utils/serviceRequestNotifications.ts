import { supabase } from '../supabase/client';

export type ServiceRequestType = 'illustration' | 'lab_website' | 'workshop';

type ServiceRequestPayload = Record<string, unknown>;

export async function notifyServiceRequest(
  type: ServiceRequestType,
  record: ServiceRequestPayload
): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('notify-service-request', {
      body: {
        type,
        record,
        page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      },
    });

    if (error) {
      console.warn('Service request saved, but email notification failed:', error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Service request saved, but email notification failed:', error);
    return false;
  }
}
