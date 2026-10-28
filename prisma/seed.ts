// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create default admin user
    // Create Admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@printcare.com' },
      update: {
        password: adminPassword,
        role: Role.ADMIN,
      },
      create: {
        email: 'admin@printcare.com',
        username: 'admin',
        password: adminPassword,
        role: Role.ADMIN,
        permissions: {}, // Default permissions will be applied
      },
    });
    console.log('✅ Admin user created:', admin.username)

    // Create Super Admin user
    // Password: 64 characters long, highly secured
    const superAdminPasswordStr = 'SUp3r_S3cur3_P@ssw0rd_W1th_64_Ch@r@ct3rs_L0ng_Str1ng_F0r_S@f3ty!';
    const superAdminPassword = await bcrypt.hash(superAdminPasswordStr, 10);

    const superAdmin = await prisma.user.upsert({
      where: { email: 'superadmin@printcare.com' },
      update: {
        password: superAdminPassword,
        role: Role.SUPER_ADMIN,
      },
      create: {
        email: 'superadmin@printcare.com',
        username: 'superadmin',
        password: superAdminPassword,
        role: Role.SUPER_ADMIN,
        permissions: {}, // Default full permissions via role
      },
    });

    console.log('✅ Super Admin user created:', superAdmin.username)

    // Create default printer models
    const printerModels = [
      { modelName: 'HP LaserJet Pro M404n', brand: 'HP', type: 'LASER' as const },
      { modelName: 'Canon PIXMA G2010', brand: 'Canon', type: 'INKJET' as const },
      { modelName: 'Epson L3150', brand: 'Epson', type: 'INKJET' as const },
      { modelName: 'Brother HL-L2321D', brand: 'Brother', type: 'LASER' as const },
    ]

    for (const model of printerModels) {
      await prisma.printerModel.upsert({
        where: { modelName: model.modelName },
        update: {},
        create: model,
      })
    }
    console.log('✅ Printer models created:', printerModels.length)

    // Get created printer models for cartridge relations
    const hpModel = await prisma.printerModel.findUnique({
      where: { modelName: 'HP LaserJet Pro M404n' }
    })
    const canonModel = await prisma.printerModel.findUnique({
      where: { modelName: 'Canon PIXMA G2010' }
    })

    if (hpModel && canonModel) {
      // Create cartridge models
      const cartridgeModels = [
        {
          modelName: 'HP 58A (CF258A)',
          printerModelId: hpModel.id,
          type: 'ORIGINAL' as const,
          color: 'BLACK' as const,
          pageYield: 3000,
        },
        {
          modelName: 'Canon GI-790 Black',
          printerModelId: canonModel.id,
          type: 'ORIGINAL' as const,
          color: 'BLACK' as const,
          pageYield: 7000,
        }
      ]

      for (const cartridge of cartridgeModels) {
        await prisma.cartridgeModel.upsert({
          where: { modelName: cartridge.modelName },
          update: {},
          create: cartridge,
        })
      }
      console.log('✅ Cartridge models created:', cartridgeModels.length)
    }

    // Create default settings
    const settings = [
      { key: 'COMPANY_NAME', value: 'PrintCare Solutions', description: 'Company Name' },
      { key: 'GST_NUMBER', value: '27XXXXX1234X1Z5', description: 'GST Registration Number' },
      { key: 'DEFAULT_TAX_RATE', value: '18', description: 'Default Tax Rate (%)' },
      { key: 'CURRENCY', value: 'INR', description: 'Currency' },
    ]

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting,
      })
    }
    console.log('✅ Settings created:', settings.length)

    // Create cities
    const cities = [
      { name: 'Mumbai', state: 'Maharashtra' },
      { name: 'Delhi', state: 'Delhi' },
      { name: 'Bangalore', state: 'Karnataka' },
      { name: 'Hyderabad', state: 'Telangana' },
      { name: 'Ahmedabad', state: 'Gujarat' },
      { name: 'Chennai', state: 'Tamil Nadu' },
      { name: 'Kolkata', state: 'West Bengal' },
      { name: 'Pune', state: 'Maharashtra' },
      { name: 'Jaipur', state: 'Rajasthan' },
      { name: 'Surat', state: 'Gujarat' },
      { name: 'Lucknow', state: 'Uttar Pradesh' },
      { name: 'Kanpur', state: 'Uttar Pradesh' },
      { name: 'Nagpur', state: 'Maharashtra' },
      { name: 'Indore', state: 'Madhya Pradesh' },
      { name: 'Thane', state: 'Maharashtra' },
      { name: 'Bhopal', state: 'Madhya Pradesh' },
      { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
      { name: 'Pimpri-Chinchwad', state: 'Maharashtra' },
      { name: 'Patna', state: 'Bihar' },
      { name: 'Vadodara', state: 'Gujarat' },
      { name: 'Ghaziabad', state: 'Uttar Pradesh' },
      { name: 'Ludhiana', state: 'Punjab' },
      { name: 'Agra', state: 'Uttar Pradesh' },
      { name: 'Nashik', state: 'Maharashtra' },
      { name: 'Faridabad', state: 'Haryana' },
      { name: 'Meerut', state: 'Uttar Pradesh' },
      { name: 'Rajkot', state: 'Gujarat' },
      { name: 'Kalyan-Dombivali', state: 'Maharashtra' },
      { name: 'Vasai-Virar', state: 'Maharashtra' },
      { name: 'Varanasi', state: 'Uttar Pradesh' },
      { name: 'Srinagar', state: 'Jammu and Kashmir' },
      { name: 'Aurangabad', state: 'Maharashtra' },
      { name: 'Dhanbad', state: 'Jharkhand' },
      { name: 'Amritsar', state: 'Punjab' },
      { name: 'Navi Mumbai', state: 'Maharashtra' },
      { name: 'Allahabad', state: 'Uttar Pradesh' },
      { name: 'Ranchi', state: 'Jharkhand' },
      { name: 'Howrah', state: 'West Bengal' },
      { name: 'Coimbatore', state: 'Tamil Nadu' },
      { name: 'Jabalpur', state: 'Madhya Pradesh' },
      { name: 'Gwalior', state: 'Madhya Pradesh' },
      { name: 'Vijayawada', state: 'Andhra Pradesh' },
      { name: 'Jodhpur', state: 'Rajasthan' },
      { name: 'Madurai', state: 'Tamil Nadu' },
      { name: 'Raipur', state: 'Chhattisgarh' },
      { name: 'Kota', state: 'Rajasthan' },
      { name: 'Chandigarh', state: 'Chandigarh' },
      { name: 'Guwahati', state: 'Assam' },
      { name: 'Solapur', state: 'Maharashtra' },
      { name: 'Hubli-Dharwad', state: 'Karnataka' },
      { name: 'Bhavnagar', state: 'Gujarat' }
    ]

    console.log('Creating cities...')
    for (const cityData of cities) {
      await prisma.city.upsert({
        where: { name: cityData.name },
        update: {},
        create: {
          name: cityData.name,
          state: cityData.state,
          country: 'India'
        }
      })
    }
    console.log('✅ Cities created:', cities.length)

    // Create additional printer models
    const additionalPrinterModels = [
      { modelName: 'HP LaserJet Pro M15w', brand: 'HP', type: 'LASER' as const },
      { modelName: 'Canon PIXMA G3020', brand: 'Canon', type: 'INKJET' as const },
      { modelName: 'Epson EcoTank L3250', brand: 'Epson', type: 'INKJET' as const },
      { modelName: 'Epson EcoTank L5190', brand: 'Epson', type: 'INKJET' as const },
      { modelName: 'Brother DCP-L2541DW', brand: 'Brother', type: 'LASER' as const },
      { modelName: 'Samsung Xpress M2020', brand: 'Samsung', type: 'LASER' as const },
      { modelName: 'Xerox WorkCentre 3025', brand: 'Xerox', type: 'LASER' as const }
    ]

    for (const model of additionalPrinterModels) {
      await prisma.printerModel.upsert({
        where: { modelName: model.modelName },
        update: {},
        create: model,
      })
    }
    console.log('✅ Additional printer models created:', additionalPrinterModels.length)

    // Create additional settings
    const additionalSettings = [
      { key: 'auto_backup_enabled', value: 'true', description: 'Enable automatic database backups' },
      { key: 'notification_email', value: 'notifications@printcare.com', description: 'Email for system notifications' }
    ]

    for (const setting of additionalSettings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting,
      })
    }
    console.log('✅ Additional settings created:', additionalSettings.length)

    // --- EXPANDED SEEDING: ALL MODULES ---
    console.log('📦 Starting expanded seeding for all modules...')

    // 1. More Users
    const managerPassword = await bcrypt.hash('manager123', 10);
    const manager = await prisma.user.upsert({
      where: { email: 'manager@printcare.com' },
      update: {},
      create: {
        email: 'manager@printcare.com',
        username: 'manager',
        password: managerPassword,
        role: 'MANAGER',
        permissions: {},
      }
    });

    const employeePassword = await bcrypt.hash('employee123', 10);
    const employee = await prisma.user.upsert({
      where: { email: 'employee@printcare.com' },
      update: {},
      create: {
        email: 'employee@printcare.com',
        username: 'employee',
        password: employeePassword,
        role: 'EMPLOYEE',
        permissions: {},
      }
    });

    const clientUserPassword = await bcrypt.hash('client123', 10);
    await prisma.user.upsert({
      where: { email: 'client@adani.com' },
      update: {},
      create: {
        email: 'client@adani.com',
        username: 'adani_client',
        password: clientUserPassword,
        role: 'CLIENT',
        permissions: {},
      }
    });
    console.log('✅ Additional users created')

    // 2. Client Groups
    await prisma.clientGroup.create({
      data: {
        name: 'Corporate Clients',
        description: 'Large enterprise clients with multiple branches',
      }
    });
    console.log('✅ Client groups created')

    // 3. Detailed Clients & Branches
    const mumbai = await prisma.city.findFirst({ where: { name: 'Mumbai' } });
    const surat = await prisma.city.findFirst({ where: { name: 'Surat' } });

    if (mumbai && surat) {
      console.log('Creating sample clients...')
      const client1 = await prisma.client.upsert({
        where: { clientCode: 'CLINT001' },
        update: {},
        create: {
          clientCode: 'CLINT001',
          companyName: 'Reliance Industries',
          contactPerson: 'Mukesh Ambani',
          email: 'mukesh@ril.com',
          phone: '9876543210',
          address: 'Maker Chambers, Nariman Point',
          state: 'Maharashtra',
          pincode: '400021',
          cityId: mumbai.id,
          createdById: admin.id,
          clientType: 'REGULAR',
        }
      });

      const client2 = await prisma.client.upsert({
        where: { clientCode: 'CLINT002' },
        update: {},
        create: {
          clientCode: 'CLINT002',
          companyName: 'Tata Consultancy Services',
          contactPerson: 'Cyrus Mistry',
          email: 'cyrus@tcs.com',
          phone: '9876543211',
          address: 'TCS House, Raveline Street',
          state: 'Maharashtra',
          pincode: '400001',
          cityId: mumbai.id,
          createdById: admin.id,
          isActive: true,
        }
      });

      const client3 = await prisma.client.upsert({
        where: { clientCode: 'CLINT003' },
        update: {},
        create: {
          clientCode: 'CLINT003',
          companyName: 'Adani Group',
          contactPerson: 'Gautam Adani',
          email: 'gautam@adani.com',
          phone: '9876543215',
          address: 'Adani Corporate House',
          state: 'Gujarat',
          pincode: '382421',
          cityId: surat.id,
          createdById: admin.id,
          clientType: 'REGULAR',
        }
      });
      console.log('✅ Sample clients created')

      // Branches
      await prisma.branch.createMany({
        data: [
          { branchName: 'Reliance Navi Mumbai', address: 'Reliance Corporate Park, Ghansoli', contactPerson: 'John Doe', phone: '9000000001', clientId: client1.id },
          { branchName: 'TCS Andheri', address: 'Andheri Kurla Road', contactPerson: 'Jane Doe', phone: '9000000002', clientId: client2.id },
        ]
      });
      console.log('✅ Client branches created')

      // 4. Agreements
      const agreement1 = await prisma.agreement.upsert({
        where: { agreementNumber: 'AGR-2024-001' },
        update: {},
        create: {
          agreementNumber: 'AGR-2024-001',
          clientId: client1.id,
          agreementType: 'RENTAL',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          status: 'ACTIVE',
          monthlyRental: 5000,
          perPageRate: 0.50,
          terms: 'Standard rental terms',
        }
      });
      console.log('✅ Sample agreements created')

      // 5. Printers & Client-Printer Mapping
      const laserJetModel = await prisma.printerModel.findFirst({ where: { brand: 'HP', type: 'LASER' } });
      if (laserJetModel) {
        const printer1 = await prisma.printer.upsert({
          where: { serialNumber: 'SN-HP-SEC-101' },
          update: {},
          create: {
            serialNumber: 'SN-HP-SEC-101',
            modelId: laserJetModel.id,
            condition: 'NEW',
            location: 'WAREHOUSE',
          }
        });

        await prisma.clientPrinter.upsert({
          where: { clientId_printerId: { clientId: client1.id, printerId: printer1.id } },
          update: {},
          create: {
            clientId: client1.id,
            printerId: printer1.id,
            installDate: new Date('2024-01-05'),
            rentalType: 'MONTHLY_RENTAL',
            monthlyRental: 2500,
            currentPageCount: 100,
          }
        });

        // 6. Page Counting
        const cp = await prisma.clientPrinter.findFirst({ where: { clientId: client1.id, printerId: printer1.id } });
        if (cp) {
          await prisma.pageCounting.create({
            data: {
              clientPrinterId: cp.id,
              pageCount: 1200,
              previousCount: 100,
              pagesUsed: 1100,
              readBy: 'Technician A',
            }
          });
        }
      }
      console.log('✅ Printers and page counts created')

      // 7. Cartridge Inventory
      const tonerModel = await prisma.cartridgeModel.findFirst({ where: { color: 'BLACK' } });
      if (tonerModel) {
        await prisma.cartridge.createMany({
          data: [
            { modelId: tonerModel.id, batchNumber: 'BAT-1001', condition: 'NEW', location: 'WAREHOUSE' },
            { modelId: tonerModel.id, batchNumber: 'BAT-1002', condition: 'NEW', location: 'WAREHOUSE' },
          ]
        });
      }
      console.log('✅ Cartridge inventory created')

      // 8. Orders, Dispatches & Financials (skip if already seeded)
      const existingOrder = await prisma.order.findUnique({ where: { orderNumber: 'ORD-2024-101' } });
      if (!existingOrder) {
        const order1 = await prisma.order.create({
          data: {
            orderNumber: 'ORD-2024-101',
            clientId: client1.id,
            createdById: admin.id,
            status: 'DELIVERED',
            totalAmount: 1500,
            orderItems: {
              create: [
                { cartridgeModelId: tonerModel!.id, quantity: 1, unitPrice: 1500, totalPrice: 1500 }
              ]
            }
          }
        });

        await prisma.dispatch.create({
          data: {
            dispatchNumber: 'DSP-2024-101',
            orderId: order1.id,
            clientId: client1.id,
            status: 'DELIVERED',
            deliveryBoy: 'Suresh Raina',
          }
        });

        const bill1 = await prisma.bill.create({
          data: {
            billNumber: 'BILL-2024-101',
            clientId: client1.id,
            billType: 'CARTRIDGE',
            subtotal: 1500,
            taxAmount: 270,
            totalAmount: 1770,
            balanceAmount: 0,
            paidAmount: 1770,
            status: 'PAID',
          }
        });

        await prisma.payment.create({
          data: {
            paymentNumber: 'PAY-2024-101',
            clientId: client1.id,
            billId: bill1.id,
            amount: 1770,
            paymentMethod: 'ONLINE',
            status: 'CLEARED',
            transactionId: 'TXN_ONLINE_999',
          }
        });
        console.log('✅ Orders, Dispatches, Bills, and Payments created')
      } else {
        console.log('⏭️ Orders, Dispatches, Bills, and Payments already exist — skipping')
      }

      // 9. Service records: Complaints, Replacements, Terminations (skip if already seeded)
      const existingComplaint = await prisma.complaint.findFirst({ where: { complaintNumber: 'COMP-2024-501' } });
      if (!existingComplaint) {
        await prisma.complaint.create({
          data: {
            complaintNumber: 'COMP-2024-501',
            clientId: client1.id,
            title: 'Paper feed issue',
            description: 'Constant jamming in Tray 2',
            category: 'PRINTER_ISSUE',
            priority: 'HIGH',
            status: 'RESOLVED',
            resolution: 'Replaced paper feed rollers',
          }
        });

        const cp1 = await prisma.clientPrinter.findFirst();
        if (cp1) {
          await prisma.replacement.create({
            data: {
              clientId: client1.id,
              oldPrinterId: cp1.printerId,
              newPrinterId: cp1.printerId,
              replacementDate: new Date(),
              reason: 'Preventive maintenance replacement',
              technicianName: 'Suresh Raina',
              status: 'COMPLETED',
            }
          });
        }

        const existingTermination = await prisma.termination.findFirst({ where: { terminationNumber: 'TRM-2024-901' } });
        if (!existingTermination) {
          await prisma.termination.create({
            data: {
              terminationNumber: 'TRM-2024-901',
              clientId: client2.id,
              terminationDate: new Date(),
              effectiveDate: new Date(),
              reason: 'Client relocated',
              refundAmount: 0,
              processedBy: admin.id,
              status: 'PROCESSED',
            }
          });
        }
        console.log('✅ Service records (Complaints, Replacements, Terminations) created')
      } else {
        console.log('⏭️ Service records already exist — skipping')
      }
    }

    console.log('🎉 Database seeded successfully!')
    console.log('📋 Summary:')
    console.log('   - Admin user: admin@printcare.com / admin123')
    console.log('   - Cities:', cities.length)
    console.log('   - Printer models:', printerModels.length + additionalPrinterModels.length)
    console.log('   - Cartridge models: 2')
    console.log('   - Settings:', settings.length + additionalSettings.length)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })