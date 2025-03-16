import React, { Suspense } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { getCredentialsForUser } from '@/actions/credentials/getCredentialsForUser'
import { Card } from '@/components/ui/card'
import CreateCredentialDialog from './_components/CreateCredentialDialog'
import { formatDistanceToNow } from 'date-fns'
import DeleteCredentialDialog from './_components/DeleteCredentialDialog'

const CredentialsPage = () => {
  return (
    <div className='flex flex-col flex-1 h-full'>
      <div className='flex justify-between'>
        <div className='flex flex-col'>
          <h1 className='text-3xl'>Credentials</h1>
          <p className='text-muted-foreground'>Manage Your Credentials</p>
        </div>
      </div>
      <div className='space-y-8 py-6 h-full'>
        
        <Alert>
          <ShieldIcon className='stroke-primary w-4 h-4' />
          <AlertTitle className='text-primary'>
            Secure Your Credentials
          </AlertTitle>
          <AlertDescription>
            Make sure you keep your credentials safe and secure. Do not share
            them with anyone.
          </AlertDescription>
        </Alert>

        <CreateCredentialDialog/>

        <Suspense fallback={<Skeleton className='w-full h-[300px]' />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  )
}

async function UserCredentials () {
  const credentials = await getCredentialsForUser()

  if (!credentials) {
    return <div>Something went wrong.</div>
  }

  if (credentials.length === 0) {
    return (
      <Card className='p-4 w-full'>
        <div className='flex flex-col justify-center items-center gap-4'>
          <div className='flex justify-center items-center bg-accent rounded-full w-20 h-20'>
            <ShieldOffIcon size={40} className='stroke-primary' />
          </div>
          <div className='flex flex-col gap-1 text-center'>
            <p className='text-bold'>No credentials created yet</p>
            <p className='text-muted-foreground text-sm'>
              Click the button to create your first credential
            </p>
          </div>

          `<CreateCredentialDialog triggerText='Create Your First Credential' />
        </div>
      </Card>
    )
  }

  return (
    <div className='flex flex-wrap gap-2'>
      {credentials.map(credential => {
        const createdAt = formatDistanceToNow(credential.createdAt, { addSuffix: true })
        return (
          <Card key={credential.id} className='flex justify-between p-4 w-full'>
            <div className='flex items-center gap-2'>
              <div className='flex justify-center items-center bg-primary/10 rounded-full'>
                <LockKeyholeIcon size={18} className='stroke-primary'/>
              </div>
              <div>
                <p className="font-bold">{credential.name}</p>
                <p className="text-muted-foreground text-xs">{createdAt}</p>
              </div>
            </div>

            <DeleteCredentialDialog name={credential.name} />
          </Card>
        )
      })}
    </div>
  )
}

export default CredentialsPage
