import { PrismaClient } from '@prisma/client';

describe('Database Schema', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('User Model', () => {
    it('should have required fields', async () => {
      const userTableInfo = await prisma.$queryRaw`
        SELECT column_name, is_nullable, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'User'
      `;
      
      expect(userTableInfo).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            column_name: 'id',
            is_nullable: 'NO',
            data_type: 'text'
          }),
          expect.objectContaining({
            column_name: 'email',
            is_nullable: 'NO',
            data_type: 'text'
          }),
          expect.objectContaining({
            column_name: 'name',
            is_nullable: 'YES',
            data_type: 'text'
          }),
          expect.objectContaining({
            column_name: 'createdAt',
            is_nullable: 'NO',
            data_type: 'timestamp without time zone'
          }),
          expect.objectContaining({
            column_name: 'updatedAt',
            is_nullable: 'NO',
            data_type: 'timestamp without time zone'
          })
        ])
      );
    });
  });

  describe('Model Schema', () => {
    it('should have required fields', async () => {
      const modelTableInfo = await prisma.$queryRaw`
        SELECT column_name, is_nullable, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'Model'
      `;
      
      expect(modelTableInfo).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            column_name: 'id',
            is_nullable: 'NO',
            data_type: 'text'
          }),
          expect.objectContaining({
            column_name: 'name',
            is_nullable: 'NO',
            data_type: 'text'
          }),
          expect.objectContaining({
            column_name: 'description',
            is_nullable: 'YES',
            data_type: 'text'
          }),
          expect.objectContaining({
            column_name: 'provider',
            is_nullable: 'NO',
            data_type: 'text'
          }),
          expect.objectContaining({
            column_name: 'createdAt',
            is_nullable: 'NO',
            data_type: 'timestamp without time zone'
          }),
          expect.objectContaining({
            column_name: 'updatedAt',
            is_nullable: 'NO',
            data_type: 'timestamp without time zone'
          })
        ])
      );
    });
  });

  describe('Agent Instance Schema', () => {
    it('should have required fields', async () => {
      const agentTableInfo = await prisma.$queryRaw`
        SELECT column_name, is_nullable, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'AgentInstance'
      `;
      
      expect(agentTableInfo).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            column_name: 'id',
            is_nullable: 'NO',
            data_type: 'text'
          }),
          expect.objectContaining({
            column_name: 'name',
            is_nullable: 'NO',
            data_type: 'text'
          }),
          expect.objectContaining({
            column_name: 'userId',
            is_nullable: 'NO',
            data_type: 'text'
          }),
          expect.objectContaining({
            column_name: 'modelId',
            is_nullable: 'NO',
            data_type: 'text'
          }),
          expect.objectContaining({
            column_name: 'configuration',
            is_nullable: 'YES',
            data_type: 'jsonb'
          }),
          expect.objectContaining({
            column_name: 'createdAt',
            is_nullable: 'NO',
            data_type: 'timestamp without time zone'
          }),
          expect.objectContaining({
            column_name: 'updatedAt',
            is_nullable: 'NO',
            data_type: 'timestamp without time zone'
          })
        ])
      );
    });
  });
}); 