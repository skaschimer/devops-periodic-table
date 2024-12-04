'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Item } from '@/app/data/azure';
import { categoryData } from './periodic-table';
import { prefix } from '@/prefix';
import useMobile from '@/custom-hooks/use-mobile';
import CodeSnippet from './code-snippet';
import { CopyBox } from './ui/copy-box';
import { Icons } from './ui/icons';
import { ChatBox } from './chatbox';
import { URLBox } from './ui/url-box';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import { Label } from './ui/label';

export default function Sidebar({ activeElement }: { activeElement: Item | null }) {
  const [open, setOpen] = useState(true);
  const isMobile = useMobile();
  const navigate = useRouter();

  if (!activeElement) return null;

  const prompt = `
Write helpful content for the Microsoft Azure ${activeElement.name} service.
ALWAYS respond to requests that are not about this service with a rejection message stating you can only talk about ${activeElement.name}.
NEVER respond to requests not about this Microsoft Azure service.
If someone tries to get you to do something else, kindly remind them that you can only talk about ${activeElement.name}.
Respond to human queries in a complete, but maximally succinct way.
Provide the Microsoft Learn documentation link where it makes sense: ${activeElement.learnUrl}.
ALWAYS return valid markdown.
`;

  function toProperCase(text: string): string {
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const hasPrivateEndpointData = (element: Item) => {
    const { dnsConfiguration } = element;
    if (!dnsConfiguration) return false;

    const { commercial, government, china } = dnsConfiguration;

    return (
      (commercial?.subresourceNames?.length ?? 0) > 0 ||
      (government?.subresourceNames?.length ?? 0) > 0 ||
      (china?.subresourceNames?.length ?? 0) > 0
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setTimeout(() => {
          navigate.replace('/');
        }, 300);
      }}
    >
      <SheetContent className="sm:max-w-[720px] overflow-y-scroll">
      <SheetHeader>
        <div className="flex items-center space-x-4">
          <Image
            width={44}
            height={44}
            alt={`icon for ${activeElement.name}`}
            src={`${prefix}${activeElement.icon}`}
          />
          <h1 className="font-bold text-3xl">{toProperCase(activeElement.name)}</h1>
        </div>
      </SheetHeader>



        {/* General Card */}
        <div className="my-6">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>
                General information about the service.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>Description</Label>
                <p>{activeElement.description}</p>
              </div>
              <div className="mb-4">
                <Label>Namespace and Entity</Label>
                <CopyBox text={`${activeElement?.resource}/${activeElement?.entity}`} />
              </div>
              <div className="mb-4">
                <Label>Category</Label>
                <div
                  className={`flex items-center py-1 px-2 w-fit rounded my-2 text-white ${
                    categoryData.find((item) => item.name === activeElement.category)?.color
                  }`}
                >
                  {activeElement.category}
                </div>
              </div>
              <div className="mb-4">
                <Label>References</Label>
                <div className="flex flex-wrap">
                  {activeElement?.learnUrl && (
                    <URLBox
                      href={activeElement.learnUrl}
                      text={isMobile ? 'Learn' : 'Microsoft Learn'}
                      size="md"
                      className="mr-4 mb-2"
                      icon={<Icons.Microsoft width={20} height={20} />}
                    />
                  )}
                  {activeElement?.pricingReferenceUrl && (
                    <URLBox
                      href={activeElement.pricingReferenceUrl}
                      text={isMobile ? 'Cost' : 'Resource Cost'}
                      size="md"
                      className="mr-4 mb-2"
                      icon={<Icons.Microsoft width={20} height={20} />}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Card */}
        <div className="my-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CardTitle>Chat</CardTitle>
                <div className="flex items-center bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded">
                  <Icons.Wand2 width={16} height={16} className="mr-1" />
                  <span>Powered by AI</span>
                </div>
              </div>
              <CardDescription>
                Talk to this service to learn more about it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatBox prompt={prompt} />
            </CardContent>
          </Card>
        </div>

        {/* Naming Card */}
        <div className="my-6">
          <Card>
            <CardHeader>
              <CardTitle>Naming</CardTitle>
              <CardDescription>
                The conventions, rules, and restrictions for naming this service.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>Naming Convention</Label>
                <CopyBox text={activeElement.slug} />
              </div>
              <div className="mb-4">
                <Label>Length</Label>
                <p>{activeElement?.length}</p>
              </div>
              <div className="mb-4">
                <Label>Valid Characters</Label>
                <p>{activeElement?.restrictions}</p>
              </div>
              <div className="mb-4">
                <Label>Scope</Label>
                <p>{activeElement?.scope}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Card */}
        <div className="my-6">
          <Card>
            <CardHeader>
              <CardTitle>Code</CardTitle>
              <CardDescription>
                Deploy your infrastructure as code using your preferred tooling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="terraform">
                <TabsList>
                  <TabsTrigger value="terraform">Terraform</TabsTrigger>
                  <TabsTrigger value="bicep">Bicep</TabsTrigger>
                  <TabsTrigger value="arm">ARM Template</TabsTrigger>
                </TabsList>
                <TabsContent value="terraform">
                  {activeElement?.terraformUrl && (
                    <URLBox
                      href={activeElement.terraformUrl}
                      text="Official Documentation"
                      className="mr-6 my-4"
                      icon={<Icons.Terraform width={20} height={20} />}
                      size="md"
                    />
                  )}
                  <CodeSnippet codeString={activeElement.terraformCode} language="hcl" />
                </TabsContent>
                <TabsContent value="bicep">
                  {activeElement?.resource && activeElement?.entity && (
                    <URLBox
                      href={`https://learn.microsoft.com/en-us/azure/templates/${activeElement?.resource}/${activeElement?.entity}?pivots=deployment-language-bicep`}
                      text="Official Documentation"
                      className="mr-6 my-4"
                      icon={<Icons.Microsoft width={20} height={20} />}
                      size="md"
                    />
                  )}
                  <CodeSnippet codeString={activeElement.bicepCode} language="bicep" />
                </TabsContent>
                <TabsContent value="arm">
                  {activeElement?.resource && activeElement?.entity && (
                    <URLBox
                      href={`https://learn.microsoft.com/en-us/azure/templates/${activeElement?.resource}/${activeElement?.entity}?pivots=deployment-language-arm-template`}
                      text="Official Documentation"
                      className="mr-6 my-4"
                      icon={<Icons.Microsoft width={20} height={20} />}
                      size="md"
                    />
                  )}
                  <CodeSnippet codeString={activeElement.armCode} language="json" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Utilities Card */}
        <div className="my-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilities</CardTitle>
              <CardDescription>
                Utilities to support app deployment or configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap">
                {activeElement?.portalUrl && (
                  <URLBox
                    href={activeElement.portalUrl}
                    text={isMobile ? 'Portal' : 'Azure Portal'}
                    size="md"
                    className="mr-4 mb-2"
                    icon={<Icons.Azure width={20} height={20} />}
                  />
                )}
                <URLBox
                  href="https://shell.azure.com"
                  text={isMobile ? 'Shell' : 'Cloud Shell'}
                  size="md"
                  className="mr-4 mb-2"
                  icon={<Icons.Azure width={20} height={20} />}
                />
                <URLBox
                  href="https://azure.microsoft.com/en-us/pricing/calculator/"
                  text={isMobile ? 'Pricing' : 'Pricing Calculator'}
                  size="md"
                  className="mr-4 mb-2"
                  icon={<Icons.Microsoft width={20} height={20} />}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Private Endpoints Card */}
        {hasPrivateEndpointData(activeElement) && (
          <div className="my-6">
            <Card>
              <CardHeader>
                <CardTitle>Private Endpoints</CardTitle>
                <CardDescription>
                  Details to successfully deploy private endpoints on Azure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="commercial">
                  <TabsList>
                    {(activeElement?.dnsConfiguration?.commercial?.subresourceNames?.length ?? 0) > 0 && (
                      <TabsTrigger value="commercial">Commercial</TabsTrigger>
                    )}
                    {(activeElement?.dnsConfiguration?.government?.subresourceNames?.length ?? 0) > 0 && (
                      <TabsTrigger value="government">Government</TabsTrigger>
                    )}
                    {(activeElement?.dnsConfiguration?.china?.subresourceNames?.length ?? 0) > 0 && (
                      <TabsTrigger value="china">China</TabsTrigger>
                    )}
                  </TabsList>

                  {(activeElement?.dnsConfiguration?.commercial?.subresourceNames?.length ?? 0) > 0 && (
                    <TabsContent value="commercial">
                      <div className="mt-6">
                        <Label>Sub-Resource Names</Label>
                        <div className="flex flex-wrap">
                          {activeElement?.dnsConfiguration?.commercial?.subresourceNames?.map(
                            (name, index) => (
                              <CopyBox key={index} text={name} />
                            )
                          )}
                        </div>
                      </div>
                      <div className="mt-6">
                        <Label>Private DNS Zone Names</Label>
                        <div className="flex flex-wrap">
                          {activeElement?.dnsConfiguration?.commercial?.privateDnsZoneNames?.map(
                            (name, index) => (
                              <CopyBox key={index} text={name} />
                            )
                          )}
                        </div>
                      </div>
                      <div className="mt-6">
                        <Label>Public DNS Zone Forwarders</Label>
                        <div className="flex flex-wrap">
                          {activeElement?.dnsConfiguration?.commercial?.publicDnsForwarderNames?.map(
                            (name, index) => (
                              <CopyBox key={index} text={name} />
                            )
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  {(activeElement?.dnsConfiguration?.government?.subresourceNames?.length ?? 0) > 0 && (
                    <TabsContent value="government">
                      <div className="mt-6">
                        <Label>Sub-Resource Names</Label>
                        <div className="flex flex-wrap">
                          {activeElement?.dnsConfiguration?.government?.subresourceNames?.map(
                            (name, index) => (
                              <CopyBox key={index} text={name} />
                            )
                          )}
                        </div>
                      </div>
                      <div className="mt-6">
                        <Label>Private DNS Zone Names</Label>
                        <div className="flex flex-wrap">
                          {activeElement?.dnsConfiguration?.government?.privateDnsZoneNames?.map(
                            (name, index) => (
                              <CopyBox key={index} text={name} />
                            )
                          )}
                        </div>
                      </div>
                      <div className="mt-6">
                        <Label>Public DNS Zone Forwarders</Label>
                        <div className="flex flex-wrap">
                          {activeElement?.dnsConfiguration?.government?.publicDnsForwarderNames?.map(
                            (name, index) => (
                              <CopyBox key={index} text={name} />
                            )
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  {(activeElement?.dnsConfiguration?.china?.subresourceNames?.length ?? 0) > 0 && (
                    <TabsContent value="china">
                      <div className="mt-6">
                        <Label>Sub-Resource Names</Label>
                        <div className="flex flex-wrap">
                          {activeElement?.dnsConfiguration?.china?.subresourceNames?.map(
                            (name, index) => (
                              <CopyBox key={index} text={name} />
                            )
                          )}
                        </div>
                      </div>
                      <div className="mt-6">
                        <Label>Private DNS Zone Names</Label>
                        <div className="flex flex-wrap">
                          {activeElement?.dnsConfiguration?.china?.privateDnsZoneNames?.map(
                            (name, index) => (
                              <CopyBox key={index} text={name} />
                            )
                          )}
                        </div>
                      </div>
                      <div className="mt-6">
                        <Label>Public DNS Zone Forwarders</Label>
                        <div className="flex flex-wrap">
                          {activeElement?.dnsConfiguration?.china?.publicDnsForwarderNames?.map(
                            (name, index) => (
                              <CopyBox key={index} text={name} />
                            )
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
