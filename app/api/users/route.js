import prisma from '../../../lib/prisma';

export async function GET(request) {
    try {
        const users = await prisma.user.findMany();
        return new Response(JSON.stringify(users), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error(error);
        return new Response("Erro ao buscar usuários", { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email } = body;

        const newUser = await prisma.user.create({
            data: { name, email }
        });

        return new Response(JSON.stringify(newUser), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });
    } catch (error) {
        console.error(error);
        return new Response('Erro ao criar usuário', { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json(); 
        const deletedUser = await prisma.user.delete({
            where: { id } 
        });

        return new Response(JSON.stringify(deletedUser), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error(error);
        return new Response("Erro ao deletar usuário", { status: 500 });
    }
}
